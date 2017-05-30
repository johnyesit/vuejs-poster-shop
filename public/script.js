var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    carts: [],
    results: [],
    search: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  computed: {
    noMoreItems: function () {
      return this.items.length === this.results.length && this.results.length > 0;
    }
  },
  methods: {
    appendItems: function () {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function () {
      if (this.search.length) {
        this.items = [];
        this.loading = true;
        this.$http.get('/search/'.concat(this.search)).then(function (res) {
          this.lastSearch = this.search;
          this.results = res.data;
          this.appendItems();
          this.loading = false;
        });
      }
    },
    addItem: function (index) {
      this.total += PRICE;
      var item = this.items[index];
      var found = false;
      for (var i = 0; i < this.carts.length; i++) {
        if (this.carts[i].id === item.id) {
          found = true;
          this.carts[i].qty++;
          break;
        }
      }
      if (!found) {
        this.carts.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: PRICE
        });
      }
    },
    inc: function (item) {
      item.qty++;
      this.total += PRICE;
    },
    dec: function (item) {
      item.qty--;
      this.total -= PRICE;
      if (item.qty <= 0) {
        for (var i = 0; i < this.carts.length; i++) {
          if (this.carts[i].id === item.id) {
            this.carts.splice(i, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function (price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function () {
    this.onSubmit();

    var that = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function () {
      that.appendItems();
    })
  }
});
