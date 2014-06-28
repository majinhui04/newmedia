/*
 *   文章类别管理
 *   
 */
define(function(require, exports, module) {
    
    var Utils = require('utils');
    var app = require('dashboardApp');


    app.register.controller('articleTypeCtrl', ['$scope', '$q', 'mLoading','mNotice','resource',
        function($scope, $q, mLoading,mNotice,resource) {
            var articleTypeDao = resource('/topicType');


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
                articleTypeDao._delete({ id:data.id, __isShowError:true,__isHideLoading:true },function(result){
                    mNotice('删除成功','success');
                },function(){

                },function(){
                    Utils.removeItem(dataList,data,'id');
                });
            };
            $scope.list = function(){
                
                articleTypeDao.list({ __isShowLoading:true,__isShowError:true,__isHideLoading:true },function(result){
                    var list = result.data || [];
                    console.log(list);

                    $scope.dataList = list;

                });
            };
            $scope.update = function(formData){
                var dataList = $scope.dataList || [];

                articleTypeDao.update(formData,function(result){
                    
                    Utils.updateItem(dataList,formData,'id');
                    swtichTab('list');
                });

            };
            $scope.create = function(formData){
                var dataList = $scope.dataList || [];
                articleTypeDao.create(formData,function(result){
                    var data = result.data || {},id = data.id;

                    formData.id = id;
                    Utils.addItem(dataList,formData);
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
            


            $scope.list();
       
           
           

        }
    ]);


    return app;
});