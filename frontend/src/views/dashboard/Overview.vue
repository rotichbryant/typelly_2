<template>
    <CCol class="p-3" md="12" xs="12">
        <CRow>
            <CCol :xs="3">
                <CWidgetStatsC class="mb-3" value="87.500" color="success" inverse :progress="{ value: 100 }" title="Clients">
                    <template #icon><CIcon icon="cil-address-book" height="36"/></template>
                </CWidgetStatsC>
            </CCol>
            <CCol :xs="3">
                <CWidgetStatsC class="mb-3" value="87.500" color="info" inverse  :progress="{ value: 100 }" title="Apps">
                    <template #icon><CIcon icon="cil-apps" height="36"/></template>
                </CWidgetStatsC>
            </CCol>
            <CCol :xs="3">
                <CWidgetStatsC class="mb-3" value="87.500" color="primary" inverse  :progress="{ value: 100 }" title="Staff">
                    <template #icon><CIcon icon="cil-group" height="36"/></template>
                </CWidgetStatsC>
            </CCol>
            <CCol :xs="3">
                <CWidgetStatsC class="mb-3" value="87.500" color="warning" inverse  :progress="{ value: 100 }" title="Payments">
                    <template #icon><CIcon icon="cil-credit-card" height="36"/></template>
                </CWidgetStatsC>
            </CCol>                                    
        </CRow>         
        <CCard class="p-2">
            <CCardBody>
                <CRow>
                    <CCol>
                        <h3>Distribution of client registration for the past 12 months.</h3>
                        <CChart
                            type="line"
                            :wrapper="false"
                            :data="chart_data"
                        />                        
                    </CCol>
                </CRow>                  
            </CCardBody>
        </CCard>
    </CCol>  
</template>

<script>
import {
  CChart,
} from '@coreui/vue-chartjs'
export default {
    components:{
        CChart
    },
    data() {
        return {
            chart_data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    data: [40, 20, 12, 39, 10, 40, 39]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    data: [50, 12, 28, 29, 7, 25, 12]
                }
                ]
            }
        }
    }
}
</script>