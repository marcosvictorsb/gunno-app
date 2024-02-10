<template>
  <div class="col-12 lg:col-12 xl:col-6">
    <div class="card mb-0">
      <div class="flex justify-content-between mb-3">
        <div>
          <span class="block text-500 font-medium mb-3">{{ title }}</span>
          <div class="text-900 font-medium text-xl">{{ amount }}</div>
        </div>
        <div class="flex align-items-center justify-content-center bg-red-100 border-round" style="width: 2.5rem; height: 2.5rem">
          <i class="material-symbols-outlined text-purple-500 text-xl">{{ icon }}</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Card',
  props: {
    amount: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: 'Titulo'
    },
    icon: {
      type: String,
      default: null
    }
  },
  created() {
    console.log({ w: this.amount });
  },
  data() {
    return {}
  }
}
</script>
<style scope></style>
