<template>
    <div id="testTip" @click="addCount">弹框测试{{count}}</div>
</template>

<script>
    export default {
        name: "Tip",
        data(){
          return {
              count: 100
          }
        },
        methods:{
            addCount: function (ev) {
                this.count++;
            }
        }

    }
</script>

<style scoped>
    #testTip{
        width: 500px;
        height: 300px;
        font-size: 30px;
        background-color: #fff;
    }
</style>