export type MemberDetails = {
  phone?: string
  email?: string
  permanentAddress?: string
  temporaryAddress?: string
  occupation?: string
  father?: string
  mother?: string
  grandfather?: string
  grandmother?: string
  dateOfBirth?: string
  donationAmount?: string
  spouse?: string
}

type NewType = {
  type: string
  _id?: string
  name: string
  img: string
  details?: MemberDetails
  rank?: number
}

export type Member = NewType
