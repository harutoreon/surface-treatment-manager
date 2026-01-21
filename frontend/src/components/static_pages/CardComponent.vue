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
  <div :id="id" class="card pt-2" style="width: 19rem;">
    <img
      :alt="alt"
      class="card-img-top w-25"
      width="50"
      height="50"
      :src="icon"
    />
    <div class="card-body">
      <p class="fs-5 card-title">
        {{ cardTitle }}
      </p>
      <p class="card-text">
        {{ cardText }}
      </p>
      <RouterLink :to="toAttribute" class="card-link">
        {{ linkText }}
      </RouterLink>
    </div>
  </div>
</template>
