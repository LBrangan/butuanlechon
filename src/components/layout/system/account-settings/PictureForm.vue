<script setup>
import AlertNotification from '@/common/AlertNotification.vue'
import { imageValidator, requiredValidator } from '@/utils/validators'
import { formActionDefault } from '@/utils/supabase.js'
import { useAuthUserStore } from '@/stores/authUser'
import { fileExtract } from '@/utils/helpers'
import { ref, watch } from 'vue'

// Use Pinia Store
const authStore = useAuthUserStore()

// State
const formDataDefault = { image: null }
const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })
const refVForm = ref()

// Preview (fallback safe)
const imgPreview = ref(
  authStore.userData?.image_url || '/images/img-profile.png'
)

let objectUrl = null

// 🔹 Handle preview
const onPreview = async (event) => {
  const { fileObject, fileUrl } = await fileExtract(event)

  // cleanup previous preview
  if (objectUrl) URL.revokeObjectURL(objectUrl)

  objectUrl = fileUrl
  formData.value.image = fileObject
  imgPreview.value = fileUrl
}

// 🔹 Reset preview
const onPreviewReset = () => {
  if (objectUrl) URL.revokeObjectURL(objectUrl)
  objectUrl = null

  formData.value.image = null
  imgPreview.value =
    authStore.userData?.image_url || '/images/img-profile.png'
}

// 🔹 Submit with proper loading and error handling
const onSubmit = async () => {
  if (!formData.value.image) return

  // Set loading state
  formAction.value = { ...formActionDefault, formProcess: true }

  try {
    // Wait for the image upload to complete
    const { error } = await authStore.updateUserImage(formData.value.image)

    if (error) {
      formAction.value.formErrorMessage = error.message || 'Failed to update image'
      formAction.value.formStatus = error.status || 500
      return
    }

    // Success - update UI with cache-busted URL
    formAction.value.formSuccessMessage = 'Successfully updated profile image.'
    imgPreview.value = authStore.userData?.image_url

    // Reset form after brief delay
    await new Promise(resolve => setTimeout(resolve, 500))
    onPreviewReset()
    refVForm.value?.reset()

  } catch (err) {
    formAction.value.formErrorMessage = err.message || 'An error occurred during upload'
    formAction.value.formStatus = 500
  } finally {
    formAction.value.formProcess = false
  }
}

// 🔹 Validate + submit
const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

// 🔹 Keep preview in sync if userData changes elsewhere
watch(
  () => authStore.userData?.image_url,
  (newUrl) => {
    if (newUrl && !formData.value.image) {
      imgPreview.value = newUrl
    }
  }
)
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  />

  <v-form ref="refVForm" @submit.prevent="onFormSubmit">
    <v-row>
      <v-col cols="12" sm="6" md="5">
        <v-img
          width="55%"
          class="mx-auto rounded-circle"
          aspect-ratio="1"
          :src="imgPreview"
          alt="Profile Picture Preview"
          cover
        />
      </v-col>

      <v-col cols="12" sm="6" md="7">
        <v-file-input
          class="mt-5"
          :rules="[requiredValidator, imageValidator]"
          accept="image/png,image/jpeg,image/bmp"
          label="Browse Profile Picture"
          prepend-icon="mdi-camera"
          show-size
          chips
          :disabled="formAction.formProcess"
          @change="onPreview"
          @click:clear="onPreviewReset"
        />

        <v-btn
          class="mt-2"
          type="submit"
          color="red-darken-4"
          prepend-icon="mdi-image-edit"
          :disabled="formAction.formProcess || !formData.image"
          :loading="formAction.formProcess"
        >
          Update Picture
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
