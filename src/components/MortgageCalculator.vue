<template>
  <div class="hello">
    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input v-model="loanAmount" class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" required id="sample4">
      <label class="mdl-textfield__label" for="sample4">Loan Amount</label>
      <span class="mdl-textfield__error">Input is not a number!</span>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input v-model="interestRate" class="mdl-textfield__input" type="text" pattern="[0-9]+(\.[0-9]+)?" required id="sample2">
      <label class="mdl-textfield__label" for="sample2">Interest Rate</label>
      <span class="mdl-textfield__error">Input is not a number!</span>
    </div>

    <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
      <input v-model="monthlyPayment" class="mdl-textfield__input" type="text" pattern="[0-9]+(\.[0-9]+)?" required id="sample3">
      <label class="mdl-textfield__label" for="sample3">Monthly payment</label>
      <span class="mdl-textfield__error">Input is not a number!</span>
    </div>
    <P>
    <button :disabled="!inputsValid" @click.prevent="calculate" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
      Calculate
    </button>
    </p>
    <p v-if="yearsToPay === -1">You Cannot Pay this mortgage</p>
    <div v-if="yearsToPay != -1">
    <p>Years to pay the mortgage {{yearsToPay}}</p>
    <p>Total paid {{totalPaid}}</p>

      <table v-if="yearsToPay != -1" class="mdl-data-table mdl-js-data-table mdl-data-table mdl-shadow--2dp">
        <thead>
          <tr>
            <th>Year</th>
            <th>Amount Outstanding</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(amount, index) in this.amounts" :key=index>
            <td>{{amount.year}}</td>
            <td>{{amount.amount}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MortgageCalculator',
  props: {
  },
  data() {
    return {
      loanAmount: 300000,
      interestRate: 1.2,
      monthlyPayment: 2000,
      amounts:[],
      yearsToPay: -1,
      totalPaid: -1,
    }
  },
  computed: {
    inputsValid() {
      if (/^[0-9]+(\.[0-9]+)?$/.test(this.loanAmount) 
      && /^[0-9]+(\.[0-9]+)?$/.test(this.interestRate)
      && /^[0-9]+(\.[0-9]+)?$/.test(this.monthlyPayment)) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
  calculate() {
        this.yearsToPay = -1
        this.totalPaid = -1

        if (this.loanAmount * (1 + this.interestRate / 100) - (this.monthlyPayment * 12) > this.loanAmount)
        {
          return
        }
        
        this.amounts = []
        var amountLeftToPay = this.loanAmount
        
        for (var i = 1; ;i++)
        {
          amountLeftToPay = amountLeftToPay * (1 + this.interestRate / 100) - (this.monthlyPayment * 12)
          this.amounts.push({year: i, amount: Math.round(amountLeftToPay)})
          if (amountLeftToPay < 0)
            break;
        }
        this.yearsToPay = i
        this.totalPaid = i * this.monthlyPayment * 12
      }
  },
    mounted() {
    this.calculate();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
    margin: 0 auto;
}
* {
  text-align: center;
}
h1 {
  margin: 40px 100px;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
