//// my scripts here
$(document).ready(function () {

	console.log('Document is ready');
	$("#sliding-welcome").animate({left: "-480px"}, 15000, "linear"); ///////////sliding welcome
	 	setTimeout(function(){ 
	 		$('#sliding-welcome').css("left","0px");
	 	}, 15000);
	setInterval(function(){
	 	$("#sliding-welcome").animate({left: "-480px"}, 15000, "linear");
	 	setTimeout(function(){ 
	 		$('#sliding-welcome').css("left","0px");
	 	}, 16000);
	}, 17000);    //////////////////sliding welcome

	/////////////////////////////////////////////////////////////chatrooms scroll messages
	$('.chatroom #messages').animate({scrollTop: 
     $('.chatroom #messages').prop("scrollHeight")}, 500); 

	//////////////////////////////////user clicks
	$(window).on('hashchange', function(e){  //detect url change
		console.log('cool hash change');
		$('.user_click').on('click', function() {
			alert('gameboy!');
		});
	});

	$("#my_picture").on("change", function() {
      $("#formId_profile").submit();
	});
	
	$('#search_trigger').on('click', function() {
		$('#search_form').slideDown('fast');
		document.querySelector('#search_field').focus();
	});
	 $(document).on('click', function(event) {
      if (!$(event.target).closest('#search_trigger, #search_form').length) {
        $('#search_form').slideUp('fast');
      }
    });

	 $('.d_close').on('click', function(){
	    $('.fa-navicon').click(); //bootstrap 2.x
	});


});

