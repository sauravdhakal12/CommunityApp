export interface NewCommunityFormType {
  name: string,
  description: string,
  paid: boolean,
  price: number | undefined,
};


export interface DbCommunityType extends NewCommunityFormType {
  id: string,
  authorId: string,
};