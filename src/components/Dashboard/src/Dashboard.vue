<template>
  <div>
    <div v-if="user">
      <h3>{{ user.type_name }} Dashboard</h3>
      <div class="input-btns">
        <el-input v-model="searchContent" placeholder="Search the table" />
        <el-popover
          placement="right"
          trigger="hover"
          width="200"
        >
          <span slot="reference">
            <el-button slot="reference">Configure</el-button>
          </span>
          <h4>Add Columns</h4>
          <el-checkbox v-model="showAll" @change="handleCheckAll">All</el-checkbox>
          <el-checkbox-group
            v-model="selected_columns"
            @change="updateCheckAll"
          >
            <el-checkbox v-for="(column, i) in columns_list" :label="column" :key="i">{{ column }}</el-checkbox>
          </el-checkbox-group>
        </el-popover>
        <!-- <el-button @click="clearFilter">Clear all filters</el-button> -->
      </div>
      <el-table
        ref="workflowTable"
        :data="filtered_table_data"
        border
        :cell-style="cellStyle"
      >
        <el-table-column
          v-if="selected_columns.includes('Workflow')"
          prop="workflow"
          label="Workflow"
          sortable
          column-key="workflow"
          :filters="workflow_filter"
          :filter-method="filterHandler"
        >
          <template slot-scope="scope">
            <a @click="openPage('workflow', scope.row.workflow)">
              {{ scope.row.workflow }}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          v-if="selected_columns.includes('Subject ID')"
          prop="subject"
          label="Subject ID"
          sortable
          column-key="subject"
          :filters="subject_filter"
          :filter-method="filterHandler"
        ></el-table-column>
        <el-table-column
          v-if="selected_columns.includes('Progress')"
          prop="progress"
          label="Progress"
          sortable
          :sort-method="sortByProgress"
          column-key="progress"
          :filters="[{ text: 'Finished', value: 'Finished' }, { text: 'In Progress', value: 'In Progress' }]"
          :filter-method="filterProgress"
        >
          <template slot-scope="scope">
            <el-dropdown>
              <span class="el-dropdown-link">
                {{ scope.row.progress }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="i in 5" :key="i">
                  <a @click="openPage('dataset', `Step ${i}`)">
                    Step {{ i }}
                  </a>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
        <el-table-column v-if="selected_columns.includes('Time')" prop="time" label="Time" sortable :sort-method="sortByTime"></el-table-column>
        <el-table-column v-if="selected_columns.includes('Age')" prop="age" label="Age (years)" sortable></el-table-column>
        <el-table-column v-if="selected_columns.includes('Height')" prop="height" label="Height (cm)" sortable></el-table-column>
        <el-table-column v-if="user.type_name === 'Researcher' && selected_columns.includes('Logs')" prop="logs" label="Logs"></el-table-column>
        <el-table-column v-if="selected_columns.includes('Actions')" label="Actions">
          <template slot-scope="scope">
            <a @click="openPage('dataset', 'id')">
              View Dataset
            </a>, 
            <a @click="deleteRow(scope.$index)">
              Terminate Process
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <h3>Please log in to use this feature.</h3>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'Dashboard',

  data: () => {
    return {
      selected_columns: [],
      workflow_filter: [],
      subject_filter: [],
      searchContent: '',
      showAll: false,
    }
  },

  props: {
    user: {
      type: Object,
      default: () => {},
    },
    table_data: {
      type: Array,
      default: () => [],
    },
    columns_list: {
      type: Array,
      default: () => [],
    },
    default_columns: {
      type: Array,
      default: () => [],
    },
  },

  created: function() {
    this.selected_columns = [...this.default_columns];
    let workflow_list = this.table_data.map(a => a.workflow);
    this.formFilter(workflow_list, this.workflow_filter);
    let subject_list = this.table_data.map(a => a.subject);
    this.formFilter(subject_list, this.subject_filter);
  },

  computed: {
    filtered_table_data: function() {
      if (this.searchContent === '')
        return this.table_data;
      else {
        let data = [];
        this.table_data.filter((item) => {
          let values = Object.values(item);
          let contain_filter = false;
          values.forEach((content) => {
            if (content.toLowerCase().includes(this.searchContent.toLowerCase())) {
              contain_filter = true;
              return;
            }
          })
          if (contain_filter) {
            data.push(item);
          }
        })
        return data;
      }
    },
  },

  methods: {
    sortByProgress(a, b) {
      if (a.progress === 'Finished')
        return 1
      else if (b.progress === 'Finished')
        return -1
      else {
        let progress1 = a.progress.split(' ');
        let progress2 = b.progress.split(' ');
        return parseFloat(progress1[1]) - parseFloat(progress2[1]);
      }
    },

    sortByTime(a, b) {
      let time1 = a.time.split(' ');
      let time2 = b.time.split(' ');
      return time1[0] - time2[0];
    },

    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },

    filterProgress(value, row, column) {
      const property = column['property'];
      if (value === 'Finished')
        return row[property] === value;
      else
        return row[property] !== 'Finished';
    },

    formFilter(item_list, filter_list) {
      item_list = Array.from(new Set(item_list));
      item_list.forEach((item) => {
        let filter = {
          text: item,
          value: item
        }
        filter_list.push(filter);
      })
    },

    clearFilter() {
      this.$refs.workflowTable.clearFilter();
    },

    deleteRow(index) {
      this.table_data.splice(index, 1);
    },

    cellStyle({ row }) {
      if (row.progress === 'Finished')
        return { backgroundColor: '#f0f9eb', padding: '1rem 0 1rem' };
      else
        return { padding: '1rem 0 1rem' };
    },

    handleCheckAll(val) {
      if (val)
        this.selected_columns = [...this.columns_list];
      else
        this.selected_columns = [];
    },

    updateCheckAll() {
      if (this.selected_columns.length === this.columns_list.length)
        this.showAll = true;
      else
        this.showAll = false;
    },

    openPage(type, val) {
      this.$emit("open-page", type, val);
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../assets/_variables.scss';

.data-table {
  border: 1px solid #E4E7ED;
}
.row {
  padding: 1rem 1rem 0 1rem;
}
.table-line {
  border: 1px solid #E4E7ED;
  margin: 1rem 0 0 0;
}
br{
  line-height: 1rem;
}
::v-deep .el-table__column-filter-trigger .el-icon-arrow-down:before {
  content: "\e7bb";
  font-size: 25px;
  color: #606266;
  vertical-align: -4px;
}
.input-btns, .btns {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 1rem 0 1rem 0;
}
.btns {
  flex-wrap: wrap;
}
.el-checkbox, .el-checkbox+.el-checkbox {
  margin-left: 0.5rem;
  display: block;
}
::v-deep .el-input__inner {
  width: 90%;
}
.el-dropdown-link {
  cursor: pointer;
  color: $app-primary-color;
}
a {
  text-decoration: none !important;
  cursor: pointer;
}
h4 {
  margin: 0;
}
</style>