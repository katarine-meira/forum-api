export class CreateQuestionDto {
  //o user ao criar uma qustão não passa o id, o dto me da a opção de esconder o que eu quiser
  title: string;
  body: string;
}
