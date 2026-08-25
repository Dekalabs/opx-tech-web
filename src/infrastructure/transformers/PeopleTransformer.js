import BaseTransformer from '@/infrastructure/transformers/BaseTransformer'

class PeopleTransformer extends BaseTransformer {
  static fetch(data) {
    return {
      name: data.name,
      height: data.height,
      mass: data.mass,
      hairColor: data.hair_color,
      skinColor: data.skin_color,
      eyeColor: data.eye_color,
      birthYear: data.birth_year,
      gender: data.gender,
    }
  }
}

export default PeopleTransformer
