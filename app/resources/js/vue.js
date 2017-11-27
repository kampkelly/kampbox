//import router from './vue-routes';
var router = require('./vue-routes');
//if(window.location.pathname == '/') {
  var parent = new Vue({
    el: '#myapp',
    router,
    data: {
      gameboy: 'yowa',
      search_text: '',
      searching: false,
      search_result: false,
      resp: '',
      countresp: '',
      style: '',
      stylechanged: false,
      stylechange_notice: 'cool',
      stylechanging: false,
  	}, 
    created() {  //fire off ajax request
            var self = this;
             axios.post('/get_this_user')
            .then(function(response) {
              console.log(response.data.style);
              console.log(response.data.style);
                self.style = response.data.style;
                if(self.style == 1){
                  $('header').css("background","#4688F1");
                  $('#navbarNavDropdown').css("background","#669cf3");
                }else{
                  $('header').css("background","brown");
                  $('#navbarNavDropdown').css("background","#be3336");
                }
                }); 
        },
      methods: {
      	search(search_text) {
          var self = this;
          this.searching = true;
          this.search_result = false;
        //  this.$router.push('/allchatrooms');
           axios.post('/search', {
                query: self.search_text,
            })
            .then(function(response) {
             console.log(response.data);
             self.resp = response.data;
             self.countresp = response.data.length;
             self.searching = false;
             self.search_result = true;
              //  self.search_text='';
               // document.querySelector('#chatroom_message').focus();
              }); 
      		console.log(this.search_text);
      	},
        modaltoggle() {
          $('#exampleModalLong').modal('hide');
        },
        changetheme(id) {
          var self = this;
          console.log('change theme');
          this.style = 'okay';
          this.stylechanging = true;
          this.stylechanged = false;
          axios.post('/changetheme', {
                background: id,
            })
            .then(function(response) {
             console.log(response.data);
              setTimeout(function(){   //timeout
                 console.log(response.data.style);
                 self.style = response.data.style;
                if(self.style == 1){
                  $('header').css("background","#4688F1");
                  $('#navbarNavDropdown').css("background","#669cf3");
                }else{
                  $('header').css("background","brown");
                  $('#navbarNavDropdown').css("background","#be3336");
                }
                 self.stylechange_notice = 'Hey! you just changed your theme color!';
                 self.stylechanging = false;
                 self.stylechanged = true;
                  setTimeout(function(){   //timeout
                     // location.reload();
                  }, 3000);    
              }, 2000);    
              }); 
        }
      }
  });
//}