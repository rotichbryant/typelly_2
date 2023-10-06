<template>
    <CModal alignment="center" :visible="modal" @close="modal = false">
        <CModalHeader>
            <CModalTitle>Preview Chatbot</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <Chatbot :tools="chatbot"/>            
        </CModalBody>
        <CModalFooter>
            <CButton color="primary" @click="$emit('update:show',false)"> Close</CButton>
        </CModalFooter>
    </CModal>    
</template>
<script lang="ts">
import { useEventSource } from '@vueuse/core'
export default {
    created(){
        console.log(this.$store);
        // this.eventSource = useEventSource(this.$store.env.);
    },
    computed:{
        chatbot(){
            return this.data;
        },
        modal(){
            return this.show;
        }
    },
    name: "Preview",
    props: {
        data: {
            default: Object(),
            type:    Object
        },
        show:{
            default: Boolean(),
            type:    Boolean    
        }
    },
    watch:{
        show(value){

        }
    }
}
</script>