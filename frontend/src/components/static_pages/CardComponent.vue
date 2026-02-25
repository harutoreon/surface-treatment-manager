<script setup>
defineProps({
  id: String,
  alt: String,
  icon: String,
  cardTitle: String,
  cardText: String,
  toAttribute: String,
  linkText: String
})
</script>

<template>
  <div :id="id" class="card pt-2 shadow-sm" style="width: 19rem;">
    <img
      :alt="alt"
      class="card-img-top w-25"
      width="50"
      height="50"
      :src="icon"
    />
    <div class="card-body">
      <h5 class="card-title">
        {{ cardTitle }}
      </h5>
      <div class="card-text mb-3">
        {{ cardText }}
      </div>
      <RouterLink :to="toAttribute" class="card-link">
        {{ linkText }}
      </RouterLink>
    </div>
  </div>
</template>
