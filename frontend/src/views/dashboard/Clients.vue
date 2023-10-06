<template>
    <CCard>
        <CCardBody>
            <CTable :columns="columns" :items="items" />
        </CCardBody>
    </CCard>
</template>

<script>
  export default {
    data: () => {
      return {
        columns: [
          {
            key: 'id',
            label: '#',
            _props: { scope: 'col' },
          },
          {
            key: 'class',
            _props: { scope: 'col' },
          },
          {
            key: 'heading_1',
            label: 'Heading',
            _props: { scope: 'col' },
          },
          {
            key: 'heading_2',
            label: 'Heading',
            _props: { scope: 'col' },
          },
        ],
        items: [
          {
            id: 1,
            class: 'Mark',
            heading_1: 'Otto',
            heading_2: '@mdo',
            _cellProps: { id: { scope: 'row' } },
          },
          {
            id: 2,
            class: 'Jacob',
            heading_1: 'Thornton',
            heading_2: '@fat',
            _cellProps: { id: { scope: 'row' } },
          },
          {
            id: 3,
            class: 'Larry the Bird',
            heading_2: '@twitter',
            _cellProps: { id: { scope: 'row' }, class: { colSpan: 2 } },
          },
        ]
      }
    },
  }
</script>