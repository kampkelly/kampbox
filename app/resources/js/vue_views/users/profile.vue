<template>
    <main class="chatrooms">
        <div style="height: 20px;"></div>
        <a href="#" class="small text-left ml-2" onclick="window.history.back();"><i class="fa fa-hand-o-left"></i> Go back</a>
        <div v-show="loading" class="text-center mt-5 pt-5" ><img src="css/loading_io/Cube-xs.svg" style="height: 70px; margin-top:70px;"></div>
        <div v-show="loaded">
        <div class="text-center" style="background: #e9e9e9; height:85vh;">
            <h4>{{user.username}}'s profile</h4> {{user.avatar}}
            <section>
                <form action="/upload_profile_pic" method="post" enctype="multipart/form-data" id="formId_profile" style="position: relative;">
                  <!--  <img src="floor.jpg" class="img-fluid img-thumbnail w-75" style="height:200px;">  -->
                    <img :src="'/images/profile_pics/' + user.avatar" class="img-fluid img-thumbnail rounded-circle w-75" style="height:200px;">
                    <i class="fa fa-camera" style="color: white; position: absolute; font-size: 250%; z-index:90; cursor:pointer; left:145px; top:37%;" v-if="user._id == auth._id"></i>
                      <input type="file" id="my_picture" name="my_profilepic" style="position: absolute; cursor:pointer; font-size: 90%; opacity: 0.001; z-index:91; left:50px; top:37%;" v-if="user._id == auth._id" v-on:click="check()"/>
                </form>
                <p>From {{user.country}}<br><br> Age: {{user.age}}</p>
                <a href="#">Add as Friend</a>
                <p class="small">Joined {{postedOn(user) }}</p>
                <p class="small">{{user.created_at}}</p>
                <router-link tag="a" :to="'/user/' + user.username + '/profile/edit'" v-if="user._id == auth._id">
                    Update Profile Details
                </router-link>
            </section>
            
        </div>
        </div>
    </main>
    
</template>

<script>

var moment = require('moment');
    module.exports = {
        data() {
            return {
                loading: '',
                loaded: '',
                user: '',
                okay: 'yeh mahn',
                auth: ''
            }
        },
        beforeRouteUpdate: function(to, from, next) {
            console.log("beforeRouteEnter");
            next();
            this.fetchData();
        },
        created() {  //fire off ajax request
            this.loading = true,
            this.loaded = false,
            self = this 
            this.fetchData()
        },
        methods: {
            fetchData () {
                axios.post('/user/' + this.$route.params.username + '/profile')
            .then(function(response) {
                self.user = response.data[0][0],
                self.auth = response.data[1],
                console.log(response.data[0]), 
                console.log('coollll'), 
                self.loading = false,
                self.loaded = true
                }); 
            },
            check() {
                $("#my_picture").on("change", function() {
                    console.log('it was changed');
                  $("#formId_profile").submit();
                });
            },
            postedOn(user) {
                return moment(user.created_at).fromNow();
            }
        }
    }
</script>
