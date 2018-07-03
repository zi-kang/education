<template>
    <div id="editorMain">
        <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @change="onEditorChange($event)" >
        </quill-editor>
    </div>
</template>

<script>
    import {quillEditor} from 'vue-quill-editor'
    export default {
        name: "editor",
        data() {
            return {
                content: this.defaultHtml,
                editorOption: {
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote', 'code-block'],
                            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
                            [{'header': [1, 2, 3, 4, 5, 6, false]}],
                            ['clean'],
                            [{'direction': 'ltr'}],
                            [{'header': 1}, {'header': 2}],// 值字体大小
                            [{'list': 'ordered'}, {'list': 'bullet'}], //值ordered，bullet
                            [{'script': 'sub'}, {'script': 'super'}],  //值sub，super
                        ]
                    },
                    placeholder: '请输入课程描述',
                    maxLength: 2
                }
            }
        },
        methods: {
            onEditorBlur() {//失去焦点事件
            },
            onEditorFocus() {//获得焦点事件
            },
            onEditorChange({ editor, html, text }) {//内容改变事件
                this.$emit("listenChangeEvent",{text: text, html: html});
            }
        },
        components: {
            quillEditor
        },
        props:{
            defaultHtml: String
        }
    }
</script>

<style scoped>
    #editorMain {
        height: 200px;
        background-color: #fff;
    }

    #editorMain * {
        border: 0 none;
    }

    .ql-toolbar.ql-snow {
        height: 30px;
    }

    .quill-editor {
        height: 160px;
    }

    .quill-editor .ql-container {
        height: 160px;
    }

    .limit {
        height: 30px;
        border: 1px solid #ccc;
        line-height: 30px;
        text-align: right;
    }

    .limit span {
        color: #ee2a7b;
    }

    .ql-snow .ql-editor img {
        max-width: 480px;
    }

    .ql-editor .ql-video {
        max-width: 480px;
    }
</style>