(function(){
    window.API = {
        version:'',
        server:'http://des-manager.wicp.net',
        mode:'',//server
        map:{
            '/user/login':{
                //local:'/api/user/validate',
                //server:true,
                description:'登录验证'
            },

            '/user/get':{
                demo:'/api/user/get',
                mode:'demo',
                description:'获取用户信息'
            },
            /*文章类别管理*/
            '/topicType/search':{
                demo:'/api/article/search',
                mode:'demo',
                description:'文章类别搜索'
            },
            '/topicType/list':{
                description:'文章类别列表'
            },
            '/topicType/get':{
                //server:'/user/get',
                description:'文章类别'
            },
            '/topicType/update':{

                description:'文章类别更新'
            },
            '/topicType/create':{
                description:'文章类别创建'
            },
            '/topicType/delete':{
                description:'文章类别删除'
            },
            /* 文章管理 */
            '/topic/search':{
                demo:'/api/topic/search',
                mode:'demo',
                description:'搜索'
            },
            '/topic/list':{
                demo:'/api/topic/list',
                mode:'demo',
                description:'列表'
            },
            '/topic/get':{
                demo:'/api/topic/get',
                mode:'demo',
                description:'某个'
            },
            '/topic/update':{
                demo:'/api/topic/update',
                mode:'demo',
                description:'更新'
            },
            '/topic/create':{
                demo:'/api/topic/create',
                mode:'demo',
                description:'创建'
            },
            '/topicType/delete':{
                demo:'/api/topic/delete',
                mode:'demo',
                description:'删除'
            },
            /*---------------------*/


            '/test/get':{
                demo:'/api/test/get',
                mode:'demo',
                description:'测试而已'
            },
            '/test/update':{
                demo:'/api/test/get',
                mode:'demo',
                description:'update 测试而已'
            }
        }
    };
    
})();