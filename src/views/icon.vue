<template>
	<div>
<Page :current="1" :total="100"></Page>
	</div>
    
</template>

<script>
import {Page} from 'iview'
export default {
  components: {
    Page
  }
}
</script>