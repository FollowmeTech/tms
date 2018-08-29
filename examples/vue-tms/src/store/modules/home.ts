import Tms from '@fmfe/tms.js';

export class IndexInput extends Tms {
  value: string ='';
  list: Array<string>= [];
  $value (value: string) {
      this.value = value;
  }
  $addItem () {
      if (this.value) {
          this.list.push(this.value);
          this.value = '';
      }
  }
  $deleteItem (index: number) {
      this.list.splice(index, 1);
  }
}

export default class Home extends Tms {
    indexInput:IndexInput = new IndexInput()
}
