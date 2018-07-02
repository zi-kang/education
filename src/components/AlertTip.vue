<template>
    <div class="delete-alert-content v-center">
        <h1 class="t-center">提示</h1>
        <p>{{msg}}</p>
        <button type="button" class="common-cancel-tip-btn" @click="cancelDelete">取消</button>
        <button type="button" class="common-delete-tip-btn" @click="confirmDelete">删除</button>
    </div>
</template>

<script>
    export default {
        name: "AlertTip",
        props:{
            msg: String
        },
        methods:{
            confirmDelete(){
                this.$emit("listenCancelDelete", {})
            },
            cancelDelete(){
                this.$emit("listenHideEvent", {})
            }
        }
    }
</script>

<style scoped lang="less">
    .delete-alert-content{
        width: 300px;
        height: 200px;
        background-color: #fff;
        border-radius: 5px;

        h1{
            height: 30px;
            margin-top: 30px;
            line-height: 30px;
            font-size: 24px;
            color: #333333;
        }
        p{
            height: 24px;
            margin: 30px 0;
            line-height: 24px;
            font-size: 18px;
            color: #999999;
        }
        button{
            width: 80px;
            cursor: pointer;
        }
        .common-cancel-tip-btn{
            margin-right: 60px;
        }
    }

</style>