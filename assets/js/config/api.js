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