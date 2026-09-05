<script setup lang="ts">
 export type Props = {
  id?: string,
  alt?: string
  icon?: string
  cardTitle?: string
  cardText?: string
  toAttribute?: string
  linkText?: string
}
defineProps<Props>()
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
