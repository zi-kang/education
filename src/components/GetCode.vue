<template>
    <div id="getCodeTip" class="v-center b-sizing">
        <h4 class="pr t-left">课程码 <i class="dlb icon-close-tip p-middle p-pointer" @click="closeTips"></i></h4>
        <p>{{code}}</p>
        <a href="javascript:void (0)" class="dlb" @click="qrcode">
            <i class="dlb vtm icon-refresh"></i>
            <span class="dlb vtm">刷新</span>
        </a>
        <div id="qrcode"></div>
    </div>
</template>

<script>
    import QRCode from 'qrcodejs2';
    export default {
        name: "GetCode",
        props:{
            code: String
        },
        mounted(){
            console.log(this.code);
            this.qrcode();
            console.log(document.getElementById('qrcode'))
        },
        methods:{
            closeTips(){
                this.$emit("listenHideEvent", {});
            },
            qrcode () {
                document.getElementById('qrcode').innerHTML = '';
                let code = this.code;
                new QRCode('qrcode', {
                    width: 360,
                    height: 360,
                    text: code,
                    render: 'canvas',
                    foreground: '#ff0'
                })
            }

        }
    }
</script>

<style scoped lang="less">
    #getCodeTip{
        width:560px;
        height:560px;
        padding: 20px;
        background:rgba(255,255,255,1);
        box-shadow:0 0 10px 0 rgba(0,0,0,0.2);
        border-radius:5px;
        border:1px solid rgba(238,238,238,1);
        h4{
            height: 24px;
            line-height: 24px;
            font-size: 24px;
            color: #666666;
            i{
                right: 0;
            }
        }
        p{
            height: 36px;
            margin: 24px auto 20px;
            line-height: 36px;
            font-size: 36px;
            color: #34C2B0;
        }
        a{
            width:140px;
            height:30px;
            margin-bottom: 20px;
            line-height: 30px;
            font-size: 0;
            background:rgba(245,246,250,1);
            border-radius:5px;
            span{
                margin-left: 10px;
                font-size:12px;
                color:rgba(102,102,102,1);
            }
        }
        #qrcode{
            width: 360px;
            height: 360px;
            margin: 0 auto;
            font-size: 0;
        }
    }
</style>