/*
 *    anuglar 通用的核心服务
 *    
 */
define(function(require, exports, module) {
    "use strict";
    var Utils = require('utils');
    
    require('angular-route');

    var IGrow = window['IGrow'];
    var API = window['API'] || {};
    var app = angular.module('angular-core', ['ngRoute']);
    

    /**/
    app.config(['$compileProvider', '$controllerProvider', '$filterProvider', '$httpProvider', '$provide', '$routeProvider' , function($compileProvider, $controllerProvider, $filterProvider, $httpProvider, $provide, $routeProvider){

        // 路由配置器
        $provide.factory('routeConfig', ['$http', function ($http) {
            return function (modules) {

                var dir = IGrow.dir;

                angular.forEach(modules, function(module , i) {
                    var timeStamp = new Date().valueOf(),
                        template = module.template,
                        templateUrl =  module.templateUrl || module.view,
                        controller = module.controller,
                        controllerUrl = module.controllerUrl || module.path,
                        body = module.body,
                        title = module.title,
                        route = module.route,
                        wrapper = module.wrapper || '',
                        config = {
                            wrapper:wrapper,
                            body:body,
                            title:title
                        };

                    if(templateUrl) {
                        config.templateUrl = ( templateUrl.indexOf('/')===0  )?templateUrl:dir + '/assets/views/' +  templateUrl;
                        config.templateUrl = config.templateUrl + '?' + timeStamp; 
                    }else if(typeof template === 'string'){
                        config.template = template;
                    }
                    // 假如需要动态加载controller
                    if( controllerUrl && typeof controller === 'string' ) {
                        config.controller = controller;
                        config.controllerUrl = ( controllerUrl.indexOf('/')===0  )?controllerUrl:dir + '/assets/js/' +  controllerUrl;
                    }else if( typeof controller === 'function' ) {
                        config.controller = controller;
                    }else{
                        config.controller = function($scope){
                            
                        };
                    }

                    // 假如是重定向
                    if(module.redirectTo){
                        $routeProvider.otherwise({ redirectTo:module.redirectTo });
                    }else {
                        $routeProvider.when(route,config);
                    }
                   
                });

            }

        }]);

        /*  module register  */
        $provide.factory('moduleRegister', ['$injector', '$log', function ($injector, $log) {
            var cache = [],
                requires = [],
                runBlocks = [],
                invokeQueue = [],
                providers = {
                    $compileProvider: $compileProvider,
                    $controllerProvider: $controllerProvider,
                    $filterProvider: $filterProvider,
                    $provide: $provide
                };
            return function (modules) {
                angular.forEach(modules, function (name, module) {
                    try {
                        if (module = angular.module(name).requires) {
                            requires = requires.concat(module);
                            this.push(name)
                        }
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + name; }
                        $log.error(ex.message);
                        throw ex
                    }
                }, modules = []);
                angular.forEach(requires, function (name) {
                    try {
                        angular.module(name) && modules.push(name)
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + name; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(modules, function (module, index) {
                    try {
                        index = modules[modules.length - index - 1];
                        module = angular.module(index);
                        if (cache.indexOf(module.name) === -1) {
                            cache.push(module.name);
                            runBlocks = runBlocks.concat(module._runBlocks);
                            invokeQueue = invokeQueue.concat(module._invokeQueue);
                        }
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + index; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(invokeQueue, function (queue, provide) {
                    try {
                        providers.hasOwnProperty(queue[0]) && (provide = providers[queue[0]]) && provide[queue[1]].apply(provide, queue[2]);
                        /*$log.error('unsupported provider ' + queue[0]);*/
                    } catch (ex) {
                        if (ex.message) { ex.message += ' from ' + queue[0]; }
                        $log.error(ex.message);
                        throw ex
                    }
                });
                angular.forEach(runBlocks, function (fn) { $injector.invoke(fn) });
            }
        }]);

    }]);
    /* 自定义ajax */
    app.factory('http', ['$http', '$q','mLoading','mNotice',
        function($http, $q ,mLoading , mNotice) {
            var Cache = {};
            var http = window['http'] = {
                ajax: function(url, data, opts,successCallback, failCallback,always) {
                    var self = this,
                        opts = opts || {},
                        data = data || {},
                        deferred = $q.defer(),
                        method = opts.type || 'GET',
                        dataType = opts.dataType || 'json',
                        timeout = opts.timeout || 60 * 1000,
                        context = opts.context || self,
                        expire = data._expire,// 数据保留时间
                        now = new Date().valueOf(),
                        params = jQuery.param(data),
                        cache_url = url + '?' + params,
                        _isShowError = data.__isShowError,
                        _isHideLoading = data.__isHideLoading,
                        _isShowLoading = data.__isShowLoading,
                        result,
                        config = {};

                    
                    delete data.__isShowError;
                    delete data.__isHideLoading;
                    delete data.__isShowLoading;
                    _isShowLoading && mLoading.show();

                    if('GET' === method && expire && Cache[cache_url] && ( now-Cache[cache_url]['t']<expire ) ) {
                        result = Cache[cache_url]['data'];
                        successCallback && successCallback(result);
                        deferred.resolve(result);
                        always && always();

                        return deferred.promise;
                    }
                    delete data._expire;
                    config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        transformRequest: function(obj) {
                            return jQuery.param(obj);
                        },
                        method: method,
                        url: url,
                        dataType: dataType,
                        data: data

                    };
                    if (method === 'POST') {
                        config.data = data;
                    } else {
                        config.params = data;
                    }

                    $http(config).success(function(data, status, headers, config) {
                        var message;
                
                        if (data.code && data.code != 0) {

                            message = data.message;
                            deferred.reject({
                                status:status,
                                message: message
                            });

                            _isShowError && mNotice(message,'error');
                        } else {
                            if(expire){
                                Cache[cache_url] = {
                                    data:data,
                                    t:now
                                };
                            }
                            successCallback && successCallback(data);
                            deferred.resolve(data);
                            always && always();
                        }
                        _isHideLoading && mLoading.hide();


                    }).error(function(data, status, headers, config) {
                        var message = '';
                        
                        if(data.code && data.code != 0){
                            message = data.message;
                            // 若未登录
                            if(data.code == 10020002){
                                var hash = location.hash || '';
                                location.href = 'http://auth.igrow.cn/auth/login?from=AUTH&go=http://m.igrow.cn/main?hash=' + hash.replace('#/','');
                            }
                        }else {
                            message = '服务器出错';
                        }
                        _isShowError && mNotice(message,'error');
                        failCallback && failCallback(data);
                        deferred.reject({
                            status:status,
                            message: message
                        });
                        always && always();
                        _isHideLoading && mLoading.hide();
                    });

                    return deferred.promise;
                },
                get: function(url, data,successCallback, failCallback,always) {

                    return this.ajax(url, data, {
                        type: 'GET'
                    },successCallback, failCallback,always);

                },
                post: function(url, data, successCallback, failCallback,always) {

                    return this.ajax(url, data, {
                        type: 'POST'
                    },successCallback, failCallback,always);

                },
                // 处理请求错误
                handleXhrError: function(xhr) {
                    var responseText,
                        error = {},
                        isResponseObject = function(xhr) {
                            return /^{/.test(xhr.responseText);
                        };

                    if (xhr.statusText === 'timeout') {
                        error.message = '请求超时 ';
                    } else if (xhr.message) {
                        error = xhr;
                    } else if (xhr.status == 500 && isResponseObject(xhr)) {
                        try {
                            responseText = xhr.responseText.replace('/\\/g', '//');
                            error = $.parseJSON(responseText);
                            error.message = error.message || '错误未知';

                        } catch (e) {
                            console.warn('responseText parse error');
                            error = {
                                message: ' 错误未知 '
                            };
                        }

                    } else {
                        error = {
                            message: ' 错误未知 '
                        };
                    }

                    error.status = xhr.status;

                    return error;
                }

            };

            return http;


        }
    ]);

    /*  自定义resource */
    app.factory('resource', ['http',
        function(http) {
            var page = IGrow['page'];
            var pagesize = IGrow['pagesize'];
            var checkURL = function(url){
                var map = API.map || {},
                    version = API.version || IGrow.version || '',
                    match;

                // 假如API里的请求配置模式是 'demo'
                if ( API.mode!=='server' && (match = map[url]) && match.mode === 'demo') {
                    url = match.demo;
                } else {
                    url = version + url;
                }

                return url;
            };
            /*
            *   @param url --> string ajax路径 example:假设完整路径 'http://m.igrow.cn/api/1.1b/school/people/get' 则url为'/school/people'
            *   @param options --> object 暂时没用
            *   @param actions --> object example :{ 'get2': { method:'GET',params:{ '默认参数1':'','默认参数2':'' } } }
            *
            *  默认返回的对象包含的方法:get,update,create,list,search,_delete   
            *  调用example
            *  var schoolPeople = resource('/school/people',{},{});
            *  schoolPeople.get({id:'1'}).then(function(result){
            *      console.log('返回的数据',result.data) ;
            *  },
            *  function(result){
            *      console.log( '错误信息',result.message );
            *  });
            */
            var $resource = function(url, options, actions) {
                var url = url || '',
                    options = options || {}, actions = actions || {},
                    resourse = {}, params;

                
                resourse = {
                    url: url,
                    list: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/list',
                            data = data || {};

                        data[page] = data._page ? data._page : 1;
                        data[pagesize] = data._pagesize ? data._pagesize : 20;
                        url = checkURL(url);

                        return http.get(url, data ,successCallback, failCallback,always);
                    },
                    get: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/get',
                            data = data || {};

                        url = checkURL(url);
                        return http.get(url, data, successCallback, failCallback,always);
                    },
                    search: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/search',
                            data = data || {};

                        data[page] = data._page ? data._page : 1;
                        data[pagesize] = data._pagesize ? data._pagesize : 20;
                        url = checkURL(url);

                        return http.get(url, data,successCallback, failCallback,always);
                    },
                    _delete: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/delete',
                            data = data || {};

                        url = checkURL(url);

                        return http.get(url, data,successCallback, failCallback,always);
                    },
                    create: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/create',
                            data = data || {};

                        url = checkURL(url);

                        return http.post(url, data,successCallback, failCallback,always);
                    },
                    update: function(data, successCallback, failCallback,always) {
                        var url = this.url + '/update',
                            data = data || {};

                        url = checkURL(url);
                        return http.post(url, data,successCallback, failCallback,always);
                    }
                };
                // 自定义action
                for (var action in actions) {
                    var opts = actions[action] || {}, method = opts.method || "GET",
                        params = opts.params || {};

                    method = method.toLowerCase();
                    resourse[action] = (function(url, action, method, params) {

                        return function(data, successCallback, failCallback,always) {
                            var data = data || {};

                            url = resourse['url'] + '/' + action;
                            url = checkURL(url);
                            data = jQuery.extend({}, params, data);

                            return http[method](url, data, successCallback, failCallback,always);

                        };

                    })(url, action, method, params)

                };



                return resourse;

            };

            return $resource;
        }
    ]);

    /* 自定义 MLoading */
    app.factory('mLoading',function(){
        return Utils.mLoading;
    });
    /* 自定义 MNotice */
    app.factory('mNotice',function(){

        return Utils.mNotice;
    });
    /* */
    app.directive('sayHello',function(){
        return {
                replace:true,
                restrict : 'E',
                templateUrl : 'helloTemplate.html',
                link:function(scope, elm, attr, ngModelCtrl){
                    //console.log(scope, elm, attr, ngModelCtrl)
                }
        }; 
    });
    /* 向下拉 向上滑 更新数据 */
    app.directive('mloadMore',function(){
        return {
            restrict: 'A',
            link: function (scope, elm, attr, ngModelCtrl) {
                var level = /Android 4.0/.test(window.navigator.userAgent) ? -10 : -100;
                var obj = $('#view>div')[0];
                var drag = elm.attr('data-drag');
                var pull = elm.attr('data-pull');
                scope.isLoadingNew = true;
                Utils.initTouch({
                    obj:obj,
                    end:function(event,offset){
                        document.ontouchmove = function(e){ return true;}
                        scope.page = scope.page || 1;
                        var scrollTop = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
                        var loadingPos = elm;
                        var loadingObjTop = loadingPos.offset().top - scrollTop - window.screen.availHeight;
                        
                        // 向上滑 drag
                        if (offset.y > 10 && loadingObjTop <= 10 && scope.isLoadingNew && !scope.isLoading) {
                            drag && scope[drag] && scope[drag]({page:++scope.page,action:'drag'});
                        }
                        // 向下拉刷新 pull
                        if (offset.y < level && scrollTop <= 0) {
                            scope.page = 1;
                            pull && scope[pull] && scope[pull]({page:1,action:'pull'});
                        }
                        
                    }
                });
            }
        };

    });
    /*
        置顶 <div class="m-gotop-box"><i class="fa fa-chevron-up"></i></div>
    */
   app.directive('gotop',function(){

        return {
            restrict: 'A',
            link: function (scope, elm, attr, ngModelCtrl) {
                var gotop = function(){
                    var scrollTop = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
                    if( scrollTop>500 ){
                        elm.show();
                    }else {
                        elm.hide();
                    }
                };
                $(window).unbind('scroll',gotop);
                $(window).bind('scroll',gotop);
                elm.bind('click',function(){
                    $(window).scrollTop(0);
                });
                
            }
        };

    });
    


    return app;


});