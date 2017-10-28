<template>
    <main class="chatrooms">
        <div v-show="loading" class="text-center mt-5 pt-5" ><img src="css/loading_io/Cube-xs.svg" style="height: 70px; margin-top:70px;"></div>
        <div v-show="loaded">
        <div style="height: 20px;"></div>
        <div class="text-center"> 
            <p>Hi, {{auth.username}}, search something...</p>
            
       
            
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
