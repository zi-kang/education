<template>
    <div class="hello">
        <h1 @click="clickFunc">{{ msg }}</h1>
        <h2 @click="clickFunc">{{ count }}</h2>
    </div>
</template>

<script>
    import Store from '../store.js';

    export default {
        name: 'HelloWorld',
        data: function(){
            return {
                // count: Store.state.count
            }
        },
        created(){
            this.request();
        },
        props: {
            msg: String
        },
        computed: {
            count: function () {
                return Store.state.count
            }
        },
        methods:{
            clickFunc () {

            },
            request(){
                setTimeout(() =>{

                }, 3000);
                //Do ajax
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
