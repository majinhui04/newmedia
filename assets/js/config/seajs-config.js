/*
*  全局配置 
*  IGrow = { api:'ajax前缀',dir:'网站根目录',modules = [] }
*/
(function(){
    var IGrow = window['IGrow'] = {
        page:'index',
        pagesize:'limit',
        server:'http://des-manager.wicp.net',
        log:function(){
            console.log.apply(console,arguments);
        },
        constant:{
           noCover:'/assets/img/public/no-cover-135.jpg',
           noAvatar:'/assets/img/public/avatar-80.png'
        },
        dashboard:[
            {
                redirectTo: '/dashboard'
            },
            {
                route:'/dashboard',
                controller:function($scope, $routeParams, $location) {
                    console.log('dashboard')
                },
                title:'欢迎',
                template:'welcome here'
            },
            {
                route:'/article/type',
                controller:'articleTypeCtrl',
                title:'文章类型管理',
                controllerUrl:'modules/dashboard/articleTypeCtrl.js',
                templateUrl:'modules/dashboard/articleTypeCtrl.html'
            },
            {
                route:'/topic',
                controller:'topicController',
                title:'文章管理',
                controllerUrl:'modules/dashboard/topicController.js',
                templateUrl:'modules/dashboard/topicController.html'
            },
            {
                route:'/test',
                controller:'testCtrl',
                title:'',
                path:'/assets/js/modules/test/testCtrl.js',
                view:'/assets/views/modules/test/test.html',
                dependency:[]
            }
        ],
        modules:[
            {
                route:'/article/type',
                controller:'articleTypeCtrl',
                title:'文章类型管理',
                path:'modules/dashboard/articleTypeCtrl.js',
                view:'modules/dashboard/articleTypeCtrl.html'
            },
            {
                route:'/test',
                controller:'testCtrl',
                title:'',
                path:'/assets/js/modules/test/testCtrl.js',
                view:'/assets/views/modules/test/test.html',
                dependency:[]
            }
            
        ]
    };

    IGrow.dir = getRootPath().replace('/assets','');// 网站根目录
    IGrow.dir = IGrow.dir.replace('/dashboard','');// 网站根目录
    

    
    // 获取站点根目录
    function getRootPath() {
        var strFullPath = window.document.location.href;
        var strPath = window.document.location.pathname;
        var pos = strFullPath.indexOf(strPath);
        var prePath = strFullPath.substring(0, pos);
        var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        return (prePath + postPath);
    }



})();

/* 
*
*  seajs 配置 
*  
*/
(function(){
    var dir = window['IGrow']['dir'],
        modules = window['IGrow']['modules'] || [],
        js = dir + '/assets/js/',
        css = dir + '/assets/css/',
        alias,module;

    // 设置别名
    alias = {
        // 库
        'webuploader.js':'http://assets.haoyuyuan.com/vendor/plugins/igrow/webuploader/1.0.0/js/webuploader.js',
        'webuploader.css':'http://assets.haoyuyuan.com/vendor/plugins/igrow/webuploader/1.0.0/css/webuploader.css',
        'angular-route':'/assets/js/vendor/libs/angularjs/1.2.14/angular-route.min.js',
        'angular-touch':'/assets/js/vendor/libs/angularjs/1.2.14/angular-touch.min.js',
        'angular-sanitize':'/assets/js/vendor/libs/angularjs/1.2.14/angular-sanitize.js',
        // 公共
        'angular-core':'/assets/js/core/angular-core.js',
        'angular-lazyload': '/assets/js/core/angular-lazyload.js',
        'utils':'/assets/js/public/utils.js',
        'scroll':'/assets/js/public/scroll.js',
        'emotion':'/assets/js/emotion.js',
        'photoLayout':'/assets/js/public/photoLayout.js',

        // app
        'loginApp':'/assets/js/core/loginApp.js',
        'dashboardApp':'/assets/js/core/dashboardApp.js'

    };

    // 将业务的js载入
    /*for( var i = 0; i < modules.length; i++ ) {
        module = modules[i];
        alias[module.name] = js + module.path;
    };*/

    // console.log('alias',alias)
    window['seajs'] && seajs.config({
        alias:alias,
        charset: 'utf-8',
        map: [
            [ /^(.*\.(?:css|js))(.*)$/i, '$1?'+new Date().valueOf() ]
        ]
    });

    window['seajs'] && seajs.on('error', function(module){

        if(module.status!=5){
            alert(module.status)
            console.error('seajs error: ', module);
        }
    });

})();