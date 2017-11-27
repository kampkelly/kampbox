<template>
    <main class="chatroom w-100">
        <div style="height: 20px;"></div>
         <a href="#" class="small text-left ml-2" onclick="window.history.back();"><i class="fa fa-hand-o-left"></i> Go back</a>
        <div v-show="loading" class="text-center mt-5 pt-5" ><img src="css/loading_io/Cube-xs.svg" style="height: 70px; margin-top:70px;"></div>
        <div v-show="loaded">
            <div class="text-center">
                 <div class="float-right" style="position: relative;" id="options_container">
                    <i class="fa fa-ellipsis-v mr-2" v-on:click="show_options(user.username, $event)"></i>
                    <div style="position:absolute; top:20px; right:0px; display:none;" id="user_options">
                        <ul class="list-unstyled pt-2 pb-2" style="background:#d8d8d8; width:150px;">
                            <li class="pb-2"><a :href="'/allchatrooms#/user/' + user.username + '/profile'" style="color: #484848;">View Profile</a></li>
                            <li><a href="#addfriend" style="color: #484848;">Add as Friend</a></li>
                        </ul>
                    </div>
                </div>
                <h5>Private Chat With {{user.username}}</h5>
               
            </div>
                <div class="h-100">
                    <div id="messages" class="border-bottom-0" style="height: 75vh;"> <!--messages container-->
                        <h4 class="p-2 text-justify mt-5" v-if="chats.length < 1">Hello, no messages yet, why not be the first to start the conversation and get an early reward!</h4>
                        <ul class="list-unstyled">
                             <div v-for="chat in chats">
                                <li class="p-1 mb-1 rounded" style="background: #fafafa;" v-if="chat.sender_username == auth.username">
                                    <div class="clearfix"><small class="float-left">Sent by 
                                    <router-link tag="a" :to="'/user/' + chat.sender_username" v-on:click="user_options(chat.sender_username, $event)">
                                        <span style="color:#949494;" v-on:click="user_options(chat.sender_username, $event)">Me: {{chat.sender_username}}</span>
                                    </router-link>
                                    </small> <small class="float-right">{{postedOn(chat) }} </small></div>
                                    <p class="d-block">{{chat.message}}</p> <div class="rw-ui-container" :data-title="chat._id" style="margin-left: 200px;"></div>
                                </li> 
                                <li class="p-1 mb-1 rounded" style="background: #c7c7c7;" v-else>
                                    <div class="clearfix"><small class="float-left">Sent by 
                                     <router-link tag="a" :to="'/user/' + chat.sender_username" v-on:click="user_options(chat.sender_username, $event)">
                                        <span v-on:click="user_options(chat.sender_username, $event)">{{chat.sender_username}}</span>
                                    </router-link>
                                    </small> <small class="float-right">{{postedOn(chat) }} </small></div>
                                    <p class="d-block">{{chat.message}}</p> <div class="rw-ui-container" :data-title="chat._id" style="margin-left: 200px;"></div>
                                </li>
                            </div>
                            <div id="append_privatechat"></div>
                        </ul>
                    </div>
                    
                    <form action="/sendchat" method="post" name="send_chatroomform" enctype="application/x-www-form-urlencoded" v-on:submit.prevent="sendChat()">
                        <input type="text" name="user_id" id="chatroom_user_id" v-model="auth._id" hidden>
                        <div class="input-group fixed-bottom">
                            <textarea id="chatroom_message" placeholder="type message" v-model="message" class="form-control" style="height:39px !important;"></textarea>
                          <span class="input-group-btn">
                            <button class="btn btn-secondary" type="submit"><i class="fa fa-paper-plane"></i></button>
                          </span>
                        </div>
                    </form>
                </div>
        </div>
    </main>
    
</template>

<script>
var moment = require('moment');
var socket = io();
var pageauth_id;

    module.exports = {
        data() {
            return {
                loading: '',
                loaded: '',
                chats: '',
                countchats: '',
                user: '',
                auth: '',
                message: ''
            }
        },
        created() {  //fire off ajax request
            this.loading = true,
            this.loaded = false,
            self = this 
             axios.post('/user/' + this.$route.params.username)
            .then(function(response) {
                self.chats = response.data[0],
                self.countchats = self.chats.length,
                self.user = response.data[1][0],
                self.auth = response.data[2],
                self.loading = false,
                self.loaded = true,
                pageauth_id = self.auth._id,
                juststarted(pageauth_id);
              //  pressenter();
                }); 
        },
        methods: {
            sendChat() {
               //  var typed_message = $('#chatroom_message').val();
                 var typed_message = this.message;
                if(typed_message == ''){
                    return;
                }   
                 self = this, 
                axios.post('/sendprivate_message', {
                    message: typed_message,
                    sender_username: self.auth.username,
                    receiver_username: self.user.username
                })
                .then(function(response) {
                emitprivatemessage( self.auth, self.user, self.auth.username, self.user.username, typed_message);
              //  self.message='',  //not working with emojionearea
               // $('#chatroom_message').data("emojioneArea").setText(""); // this work
                self.message = '',
                document.querySelector('#chatroom_message').focus();
                }); 
            },
             show_options(username, e) {
                e.preventDefault();
                console.log(e);
                $('#user_options').slideDown('fast');
                 $(document).on('click', function(event) {
                  if (!$(event.target).closest('#options_container, #user_options').length) {
                    $('#user_options').hide();
                  }
                });
            },
            user_options(username, e) {
                e.preventDefault();
                console.log(e);
                swala_options(username);
                 console.log('i clicked user_click');
            },
            postedOn(chat) {
                return moment(chat.created_at).fromNow();
            }
        }
    }

function emitprivatemessage(auth, user, auth_username, user_username, message) {
    console.log('function started');
    socket.emit('newPrivateChat',{
        sender: auth,
        receiver: user,
        sender_username: auth_username,
        receiver_username: user_username,
        message: message
      });
}
   //     socket.on('connect', function() {
       //     console.log('the guy connected in privatechat socket');
       function juststarted(pageauth_id) { ////////////////////
             socket.on('detectPrivateChat', function(data) {
            //  showMessage(data); 
                console.log('received private message');
                let date = Date();
                var person;
                person = data.sender_username;

                if(pageauth_id == data.sender._id) {
                     $( "#append_privatechat" ).append(
                       `<li class="p-1 mb-1 rounded" style="background: #fafafa;">
                            <div class="clearfix"><small class="float-left">Sent by Me: ${person}</small> <small class="float-right">${moment(String(date)).format('MMMM Do YYYY hh:mm:ss a')} </small></div>
                            <p class="d-block">${data.message}</p> 
                            <div class="rw-ui-container" data-title="${data.message}" style="margin-left: 200px;"></div>
                        </li>`
                       ); 
                }else if(pageauth_id == data.receiver._id) {
                     $( "#append_privatechat" ).append(
                       `<li class="p-1 mb-1 rounded" style="background: #c7c7c7;">
                            <div class="clearfix"><small class="float-left">Sent by ${data.sender.username}</small> <small class="float-right">${moment(String(date)).format('MMMM Do YYYY hh:mm:ss a')} </small></div>
                            <p class="d-block">${data.message}</p> 
                            <div class="rw-ui-container" data-title="${data.message}" style="margin-left: 200px;"></div>
                        </li>`
                       ); 
                }
                 $('.chatroom #messages').animate({scrollTop: 
                $('.chatroom #messages').prop("scrollHeight")}, 500); 
            });
        }
   //     });

        function swala_options(username) {
             swal({
                  html:
                  `<ul class="list-unstyled">
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
