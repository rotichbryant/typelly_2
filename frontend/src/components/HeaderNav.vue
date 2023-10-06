<template>
    <CHeader position="sticky">
      <CContainer fluid>
        <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
          <CIcon icon="cil-menu" size="lg" />
        </CHeaderToggler>
        <CHeaderNav>
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
            <CDropdownItem @click="logout"> 
              <CIcon icon="cil-lock-locked" /> 
              Logout 
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  </template>
  
<script>
export default {
    name: 'HeadNav',
    methods:{
      logout(){
        this.$store.commit('auth',{});
        window.location.reload();
      }
    },
    setup() {

    },
  }
  </script>
  