<template>
    <SideNav>
        <li class="nav-title">Nav Title</li>
        <CNavItem href="#">
            <CIcon  customClassName="nav-icon" icon="cil-speedometer"/>
            With badge
            <CBadge color="primary ms-auto">NEW</CBadge>
        </CNavItem>
        <CNavGroup>
        <template #togglerContent>
            <CIcon  customClassName="nav-icon" icon="cil-puzzle"/> Nav dropdown
        </template>
        <CNavItem href="#">
            <CIcon  customClassName="nav-icon" icon="cil-puzzle"/> Nav dropdown item
        </CNavItem>
        <CNavItem href="#">
            <CIcon  customClassName="nav-icon" icon="cil-puzzle"/> Nav dropdown item
        </CNavItem>
        </CNavGroup>        
    </SideNav>
</template>
<script lang="ts">

</script>