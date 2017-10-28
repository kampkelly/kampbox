<template>
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                <div class="panel panel-default">
                    <div style="height:300px;"></div>
                    <h4>{{statuses}}</h4>
                    <h4>Am in cool now</h4>
                <router-link tag="a" to="/" class="btn btn-success btn-lg">
                    <a>Go to home</a>
                  </router-link>
                   
                </div>
            </div>
        </div>
    </div>
</template>

<script>


  //  export default {
    module.exports = {
        data() {
            return {
                statuses: 'cool yeah'
            }
        },
        created() {  //fire off ajax request
            
        }
    }
</script>
