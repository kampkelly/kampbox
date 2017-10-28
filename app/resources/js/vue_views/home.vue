<template>
    <main class="chatrooms">
        <div v-show="loading" class="text-center mt-5 pt-5" ><img src="css/loading_io/Cube-xs.svg" style="height: 70px; margin-top:70px;"></div>
        <div v-show="loaded">
        <div style="height: 10px;"></div>
        <div class="text-center"> 
            <p>Hi, {{auth.username}},</p>
             <p id="sliding-welcome" class="text-nowrap p-1">Join any of the chatrooms below and meet new people right now</p>
            <h4 class="user_click">Chat Rooms</h4>
            <div class="row ml-3">
                <div v-for="chatroom in chatrooms">
                    <router-link tag="a" :to="'/chatroom/' + chatroom._id" class="row chatroom_row bg-light mb-3">
                        <div class="col-3">
                            <img :src="'images/chatrooms/' + chatroom.image" class="img-fluid rounded-circle h-75 w-100">
                        </div>
                        <div class="col-9">
                            <h6 class="text-left">{{chatroom.name}}</h6>
                            <p class="small text-left">{{chatroom.description}}</p>
                        </div>
                    </router-link>
                    <a href="chatroom/id/edit" v-if="auth.admin == 1">Edit</a>
                    <a href="chatroom/delete/id" v-if="auth.admin == 1">Delete</a>
                </div>
            </div>
            <a href="/chatroom/new" v-if="auth.admin == 1">Create Chatroom</a>
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
                chatrooms: '',
                auth: ''
            }
        },
        created() {  //fire off ajax request
            this.loading = true,
            this.loaded = false,
            self = this
             axios.post('/chatrooms')
            .then(function(response) {
                self.chatrooms = response.data[0],
                self.auth = response.data[1],
                console.log(response.data[0]), 
                self.loading = false,
                self.loaded = true
                }); 
        }
    }
</script>
