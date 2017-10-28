<template>
    <main class="chatrooms">
        <div style="height: 20px;"></div>
        <a href="#" class="small text-left ml-2" onclick="window.history.back();"><i class="fa fa-hand-o-left"></i> Go back</a>
        <div v-show="loading" class="text-center mt-5 pt-5" ><img src="css/loading_io/Cube-xs.svg" style="height: 70px; margin-top:70px;"></div>
        <div v-show="loaded" style="position:relative;" v-if="user._id == auth._id">
        <img src="css/loading_io/Cube-xs.svg" style="position:absolute; height: 100px; top:20%; left:30%; z-index:10;" v-show="saving">
        <div class="text-center" style="background: #e9e9e9; height:90vh;">
            <h4>Update  profile</h4> {{response}}
          {{user.username}}
          <form action="/saveprofile" method="post" class="col-12" enctype="application/x-www-form-urlencoded" v-on:submit.prevent="saveprofile">
              <div class="form-group">
                    <label for="age">Age</label>
                    <input type="number" class="form-control" id="age" name="age" aria-describedby="emailHelp" placeholder="Enter Age in numbers" v-model="age">
              </div>
              <div class="form-group">
                    <label for="country">Country</label>
                    <select name="country" v-model="country" class="form-control">
                        <option v-model="user.country">{{country}}</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="USA">USA</option>
                    </select>
              </div>
              <div class="form-group">
                    <label for="mobile">Mobile</label>
                    <input type="number" class="form-control" id="mobile" name="mobile" aria-describedby="emailHelp" placeholder="Enter Mobile No." v-model="mobile">
              </div>
              <button type="submit" class="btn btn-success btn-block">Update</button>
            </form>
            
        </div>
        </div>
    </main>
    
</template>

<script>


    module.exports = {
        data() {
            return {
                loading: '',
                loaded: '',
                user: '',
                okay: 'yeh mahn',
                auth: '',
                age: '',
                country: '',
                mobile: '',
                saving: false,
                response: ''
            }
        },
        created() {  //fire off ajax request
            this.loading = true,
            this.loaded = false,
            self = this 
             axios.post('/user/' + this.$route.params.username + '/profile')
            .then(function(response) {
                self.user = response.data[0][0],
                self.auth = response.data[1],
                self.age = response.data[1].age,
                self.country = response.data[1].country,
                self.mobile = response.data[1].mobile,
                console.log(response.data[0]), 
                self.loading = false,
                self.loaded = true
                }); 
        },
        methods: {
            saveprofile() {
                   self = this, 
                   self.saving = true,
                axios.post('/saveprofile', {
                    age: self.age,
                    country: self.country,
                    mobile: self.mobile
                })
                .then(function(response) {
                    self.saving = false,
                    self.response = response.data
                 //   document.querySelector('#chatroom_message').focus();
                }); 
            }
        }  
    }
</script>
