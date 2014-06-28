/*
 *   文章管理
 *   
 */
define(function(require, exports, module) {
    
    var Utils = require('utils');
    var app = require('dashboardApp');


    app.register.controller('topicController', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            var topicDao = resource('/topic');


            function swtichTab(action) {
                if('list' === action) {
                    $('.nav').find('[data-role="list"]').trigger('click');
                }else {
                    $('.nav').find('[data-role="edit"]').trigger('click');
                }
            }
            
            $scope._delete = function(data){
                var dataList = $scope.dataList || [];

                mLoading.show('正在删除...');
                topicDao._delete({ id:data.id, __isShowError:true,__isHideLoading:true },function(result){
                    mNotice('删除成功','success');
                    Utils.removeItem(dataList,data,'id');
                },function(){

                },function(){
                    
                });
            };
            $scope.list = function(options){
                var opts = options || {};

                topicDao.search({ __isShowLoading:true,__isShowError:true,__isHideLoading:true,_relatedfields:'type.*' },function(result){
                    var list = result.data || [];
                    console.log(list);

                    angular.forEach(list, function(item,_){
                        item._isShow = item.isshow == 1?'显示':'不显示';
                        item._isTop = item.istop==1?'置顶':'不置顶';
                    });
                    $scope.dataList = list;

                });
            };
            $scope.update = function(formData){
                var dataList = $scope.dataList || [];

                topicDao.update(formData,function(result){
                    
                    Utils.updateItem(dataList,formData,'id');
                    swtichTab('list');
                });

            };
            $scope.create = function(formData){
                var dataList = $scope.dataList || [];
                topicDao.create(formData,function(result){
                    var data = result.data || {},id = data.id;

                    //formData.id = id;
                    //Utils.addItem(dataList,formData);
                    $scope.list();
                    swtichTab('list');
                });

            };
            $scope.save  = function(){
                var formData = $scope.formData;

                console.log(formData)
                if(formData.id) {
                    $scope.update(formData);
                }else {
                    $scope.create(formData);
                }
            };

            $scope.toCreateView = function(){
                $scope.formData = {};
                swtichTab('edit');
            };
            $scope.toEditView = function(data){
                $scope.formData = angular.copy(data);
                swtichTab('edit');
            };
            $scope.toDeleteView = function(data){
                Utils.confirm('确定删除?',function(){
                    $scope._delete(data);
                });
            };
            $scope.run = function(){
                $scope.list();
            };

            $scope.run();

        }
    ]);


    return app;
});