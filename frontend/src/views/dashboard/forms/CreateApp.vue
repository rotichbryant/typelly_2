<template>
  <CModal alignment="center" :visible="modal">
    <CModalHeader>
      <CModalTitle>Modal title {{  modal }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="$emit(`updateModal`,false)">
        Close
      </CButton>
      <CButton color="primary">Save changes</CButton>
    </CModalFooter>
  </CModal>    
</template>
<script setup>
  import { computed, defineProps, defineEmits } from 'vue';

  const modal = computed(() => {
    return props.show;
  });

  const props = defineProps({
    show:{
      default: Boolean(),
      type: Boolean,
    }   
  });

  defineEmits(['updateModal'])

</script>