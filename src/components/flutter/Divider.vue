<template>
  <div>
    <div id="divider" :style="getStyle()"></div>
  </div>
</template>

<script>
import {fnc} from '@/assets/js/functions';
export default {
  name: "Divider",
  props: ['properties', 'scale', 'page'],
  data: function () {
    return {
      isRTL: window.appData.project.isRTL,
    }
  },
  methods: {
    getStyle:function () {
      console.log('red');
      let style = '';
      if (this.properties.color != 'null'){
        style += 'border-color:'+this.color2web(this.properties.color)+';';
      }
      let height = 16;
      if (this.properties.height != 'null' && this.properties.height.toString().trim() != '') {
        height = parseInt(this.properties.height);
      }
      if (this.properties.thickness != 'null' && this.properties.thickness.toString().trim() != ''){
        style += ' border-bottom-width:'+(this.properties.thickness)+'px;';
      }
      let minusWidth= 0;
      if (parseInt(this.properties.indent) > 0 && this.properties.indent.toString().trim() != ''){
         minusWidth += parseInt( this.properties.indent);
         if (this.isRTL){
           style += 'right';
         }else{
           style += 'left';
         }
         style += ':'+Math.round(parseInt(this.properties.indent) * this.scale)+'px;';
      }
      if (parseInt(this.properties.endIndent ) > 0 && this.properties.endIndent.toString().trim() != ''){
         minusWidth += parseInt(this.properties.endIndent);
      }
      style += 'width: calc(100% - '+(minusWidth * this.scale)+'px);';
      style += 'margin-top: ' + (this.scale * height * .5)+'px;';
      style += 'margin-bottom: ' + (this.scale * height + (20*this.scale) )+'px;';

      console.log(style);

      return style;
    },
    color2web: fnc.color2web,
  },
}
</script>

<style scoped>
#divider{
  height: 16px;
  border-bottom: 1px solid gray;
  position: relative;
  /*margin-bottom: var(--mb);*/
}
</style>