import { merge } from "lodash"
import { defineStore } from "pinia"
import useCourseStore from "./course.store"


const useCourseRequisiteStore = (function() {
  const courseStore = useCourseStore()

  return defineStore("CourseRequisite", {

    state: () => ({
      courseId: null,
    }),

    getters: {
      getCourse() {
        return this.courseId
      },
    },
    
    actions: {

      mapRequisites(courseRequisites)
      {
        let result = []

        courseRequisites.forEach(cr => {
          const mapped = courseStore.courses.filter(c => c.id == cr.requisiteId)
            .map(c => ({
              ...cr,
              requisite: c,
            }))
        
          result = result.concat(mapped)
        })

        return result
      },
        
      async add(courseRequisite) 
      {
        const parent = courseStore.courses.find(c => c.id == courseRequisite.parentCourseId)
            
        if (!parent) return

        // Ok
        parent.courseRequisites.push(courseRequisite)
      },

      async addAll(courseRequisites) 
      {
        courseRequisites.forEach(courseRequisite => this.add(courseRequisite))
      },

      async update(courseRequisite) 
      {
        const parent = courseStore.courses.find(c => c.id == courseRequisite.parentCourseId)
            
        if (!parent) return

        // Ok
        merge(
          parent.courseRequisites.find(cr => cr.id == courseRequisite.id),
          courseRequisite,
        )
      },

      async delete(courseRequisite)
      {
        const parent = courseStore.courses.find(c => c.id == courseRequisite.parentCourseId)
            
        if (!parent) return

        // Ok
        parent.courseRequisites = parent.courseRequisites.filter(cr => cr.id != courseRequisite.id)
      },
      
      async setCourse(courseId)
      {
        this.courseId = courseId
      },
    },

  })
})()

export default useCourseRequisiteStore
