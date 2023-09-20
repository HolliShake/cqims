<script setup>
// 👉 Page data
const computedPageData = computed(() => { 
  try {
    return JSON.parse(localStorage.getItem("selectedAcademicProgram"))
  } catch (err) {
    return null
  }
})

// 👉 Breadcrumbs
const breadCrumbs = computed(() => {

  const academicProgram = computedPageData.value ? computedPageData.value.academicProgramShortName : "Academic Program"

  return [
    {
      text: "Dashboard",
      disabled: false,
      href: "/dashboard",
    },

    // {
    //   text: "School",
    //   disabled: false,
    //   href: "/system/school",
    // },
    {
      text: academicProgram,
      disabled: false,
      href: "#",
    },
    {
      text: "Curriculums",
      disabled: true,
      href: "#",
    },
  ]
})
</script>

<template>
  <section>
    <PageHeader
      :title="computedPageData?.academicProgramName ?? 'Academic Program'"
      subtitle="Shows all curriculums of the following program."
      :breadcrumb="breadCrumbs"
    />
    <h1>Hola!</h1> 
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: system-schools
</route>
