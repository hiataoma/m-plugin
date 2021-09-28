<template>
  <div class="calculate">
    <p>{{a}}+{{b}}={{sum}}</p>
    <input type="text" v-model="a" style="width:30px;text-align:center" @blur="sumFunc"/>
    <span class="symbol">+</span>
    <input type="text" v-model="b" style="width:30px;text-align:center" @blur="sumFunc"/>
    <span class="symbol" @click="sumFunc"> = </span>
    <span class="item">{{sum}}</span>
  </div>
</template>
<script>
export default ({
  name: 'sum-function',
  props: ['num1', 'num2'],
  data () {
    return {
      a: this.num1 ? this.num1 : 0,
      b: this.num2 ? this.num2 : 0,
      sum: 0
    }
  },
  mounted () {
    this.sumFunc()
  },
  methods: {
    sumFunc () {
      const a = Number(this.a)
      const b = Number(this.b)
      if (isNaN(a) || isNaN(b)) {
      } else {
        this.sum = a + b
        this.$emit('getSumFromChild', this.sum)
      }
    }
  }
})
</script>
<style>
  
</style>