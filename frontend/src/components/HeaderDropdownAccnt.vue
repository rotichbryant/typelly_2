<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <!-- <CAvatar :src="avatar" size="md" /> -->
      <CIcon icon="cil-user" size="lg"/> 
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Settings
      </CDropdownHeader>
      <CDropdownItem @click="router.push({name:'Profile'})"> 
        <CIcon icon="cil-user" /> 
        Profile 
      </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem> 
        <CIcon icon="cil-lock-locked" /> 
        Logout 
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

</script>
