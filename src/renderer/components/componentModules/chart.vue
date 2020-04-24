<template>
  <md-card
    id="rpmChart"
    class="charts"
    style="width:400px; height:300px;"
  ></md-card>
</template>

<script>
import Dygraph from 'dygraphs'

export default {
  name: 'Chart',
  components: {},
  props: ['randData'],
  data() {
    return {
      series: [[new Date(), this.randData]]
    }
  },
  created() {
    setInterval(() => {
      let t = new Date()
      this.series.push([t, this.randData])
    }, 1000)
  },
  mounted() {
    const chart = new Dygraph(
      document.getElementById('rpmChart'),
      this.series,
      {
        drawPoints: true,
        valueRange: [0.0, 2000.0],
        labels: ['Time', 'RPM']
      }
    )
    setInterval(() => {
      if (this.series.length > 10) this.series.shift()
      chart.updateOptions({ file: this.series })
    }, 1000)
  },
  methods: {}
}
</script>

<style>
.charts {
  background-color: white;
}
</style>
