

const RequisiteType = Object.freeze({
    requisiteTypes: Object.freeze([
        {
            title: "Co-Requisite",
            value: 0,
        },
        {
            title: "Pre-Requisite",
            value: 1,
        }
    ]),
    mapRequisiteType(requisiteType) {
        return RequisiteType.requisiteTypes.find((requisite) => requisite.value == requisiteType).title
    }
})

export default RequisiteType
