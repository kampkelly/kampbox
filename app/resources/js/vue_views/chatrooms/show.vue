<template>
    <main class="chatroom w-100">
        <div v-show="loading" class="text-center mt-5 pt-5" ><img src="css/loading_io/Cube-xs.svg" style="height: 70px; margin-top:70px;"></div>
        <div v-show="loaded">
        <div style="height: 20px;"></div>
            <router-link tag="a" to="/">
                <a href="/allchatrooms" class="small text-left ml-2"><i class="fa fa-hand-o-left"></i> Back to chatrooms</a>
            </router-link>
            <div class="text-center">
                <h5>{{chatroom.name}}</h5>{{message}}
               
            </div>
                <div class="h-100">
                    <div id="messages" class="border-bottom-0" style="height: 75vh;"> <!--messages container-->
                        <h4 class="p-2 text-justify mt-5 user_click" v-if="chats.length < 1">Hello, no messages yet, why not be the first to start the conversation and get an early reward!</h4>
                        <ul class="list-unstyled">
                             <div v-for="chat in chats">
                                <li class="p-1 mb-1 rounded" style="background: #fafafa;" v-if="chat.user_id == auth._id">
                                    <div class="clearfix"><small class="float-left">Sent by 
                                    <router-link tag="a" :to="'/user/' + chat.username" v-on:click="user_options(chat.username, $event)">
                                        <span style="color:#949494;"v-on:click="user_options(chat.username, $event)">Me: {{chat.username}}</span>
                                    </router-link>
                                    </small> <small class="float-right">{{postedOn(chat) }} </small></div>
                                    <p class="d-block">{{chat.message}}</p> <div class="rw-ui-container" :data-title="chat._id" style="margin-left: 200px;"></div>
                                </li> 
                                <li class="p-1 mb-1 rounded" style="background: #c7c7c7;" v-else>
                                    <div class="clearfix"><small class="float-left">Sent by 
                                     <router-link tag="a" :to="'/user/' + chat.username" v-on:click="user_options(chat.username, $event)">
                                        <span v-on:click="user_options(chat.username, $event)">{{chat.username}}</span>
                                    </router-link>
                                    </small> <small class="float-right">{{postedOn(chat) }} </small></div>
                                    <p class="d-block">{{chat.message}}</p> <div class="rw-ui-container" :data-title="chat._id" style="margin-left: 200px;"></div>
                                </li>
                            </div>
                            <div id="usb"></div>
                        </ul>
                    </div>
                     <form id="send_chatroomform" action="/cool" v-on:submit.prevent="sendChat()">
                        <div class="panel-footer">
                            <input type="text" name="user_id" id="chatroom_user_id" v-model="auth._id" hidden>
                        <input type="text" name="chatroom_id" id="chatroom_id" v-model="chatroom._id" hidden>
                                <div class="input-group fixed-bottom">
                                    <textarea id="chatroom_message" placeholder="type message" v-model="message" class="form-control" style="height:20px !important;"></textarea>
                                    <span class="input-group-btn">
                                      <!--  <button class="btn btn-info" id="btnSend" type="submit">Send</button> -->
                                      <button class="btn btn-secondary" type="submit"><i class="fa fa-paper-plane"></i></button>
                                    </span>
                                 </div>
                    </div>
                </form>
                   <!--form here-->
                </div>
        </div>
    </main>
    
</template>

<script>
var moment = require('moment');
var socket = io();
var pagechatroom_id;

    module.exports = {
        data() {
            return {
                loading: '',
                loaded: '',
                chatroom: '',
                chats: '',
                countchats: '',
                auth: '',
                message: ''
            }
        },
        created() {  //fire off ajax request
            this.loading = true,
            this.loaded = false,
            self = this 
            console.log('am in this route'),
            thisroute();
             axios.post('/chatroom/' + this.$route.params.id)
            .then(function(response) {
                self.chatroom = response.data[0],
                self.chats = response.data[1],
                self.countchats = self.chats.length,
                self.auth = response.data[2],
                self.loading = false,
                self.loaded = true,
                pagechatroom_id = self.chatroom._id,
                juststarted(pagechatroom_id);
                pressenter();
            }); 
        },
        methods: {
            sendChat() {
                var self = this 
               var typed_message = $('#chatroom_message').val();
               console.log(typed_message);
                if(typed_message == ''){
                    return;
                }   
                emitmessage( this.auth, this.auth._id, this.chatroom._id, typed_message);
                axios.post('/sendchatroom_message', {
                    message: typed_message,
                    chatroom_id: self.chatroom._id,
                    user_id: self.auth._id,
                    group_id: '0'
                })
                .then(function(response) {
           //     emitmessage( self.auth, self.auth._id, self.chatroom._id, typed_message);
             //   self.message='',  //old binding to message doesnt work
                $('#chatroom_message').data("emojioneArea").setText(""); // this work
                document.querySelector('#chatroom_message').focus();
                }); 
            },
            user_options(username, e) {
                e.preventDefault();
                console.log(e);
                swala(username);
                 console.log('i clicked user_click');
            },
            postedOn(chat) {
                return moment(chat.created_at).fromNow();
            }
        }
    }



function emitmessage(auth, auth_id, chatroom_id, message) {
    console.log('function started');
    socket.emit('postMessage',{
        user: auth,
        user_id: auth_id,
        username: auth.username,
        chatroom_id: chatroom_id,
        message: message,
      });
}


      //  socket.on('connect', function() {
         //   console.log('the guy connected in chat socket');
            
            function juststarted(pagechatroom_id) { ////////////////////
            console.log('global');
            console.log(pagechatroom_id);
            console.log('global'); 
             socket.on('updateMessages', function(data) {
            //  showMessage(data);
                console.log('received message');
                console.log(pagechatroom_id);
                let date = Date();
                var person;
                person = data.username;

                if(pagechatroom_id == data.chatroom_id) {
                     $( "#usb" ).append(
                       `<li class="p-1 mb-1 rounded" style="background: #d0d0d0;">
                            <div class="clearfix"><small class="float-left">Sent by ${person}</small> <small class="float-right">${moment(String(date)).format('MMMM Do YYYY hh:mm:ss a')} </small></div>
                            <p class="d-block">${data.message}</p> 
                            <div class="rw-ui-container" data-title="${data.message}" style="margin-left: 200px;"></div>
                        </li>`
                       ); 
                }
                 $('.chatroom #messages').animate({scrollTop: 
                $('.chatroom #messages').prop("scrollHeight")}, 500); 
            });
           }///////////////////////

     //   });
 

        function thisroute() {
            console.log('i can now click user_click');
        }
        function swala(username) {
             swal({
                  html:
                  `<ul class="list-unstyled">
                    <li class="pb-2"> <h6><a href="/allchatrooms#/user/${username}" onclick="swal.closeModal();">Chat with ${username}</a></h6> </li>
                    <li class="pb-2"> <h6><a href="/allchatrooms#/user/${username}/profile" onclick="swal.closeModal();">View Profile</a></h6> </li>
                    <li class=""><h6>Add as friend</h6></li>
                    </ul>
                  `,
                    width: 250,
                  padding: 10,
                  background: '#f2f2f2',
                  showCloseButton: false,
                  showConfirmButton: false,
                  showCancelButton: false,
                  focusConfirm: false,
                })
        }

        function pressenter() {
              $("#chatroom_message").emojioneArea({   ///////////
                events: {
                    keypress: function (editor, event) {
                        if(event.which == 13){
                            console.log('event:keypress'); //work
                            console.log('i pressed enter');
                        }
                    },
                }
            });//////
        }


</script>
