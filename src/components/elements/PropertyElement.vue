<template>
  <div>
    <table>
      <tr>
        <th>
          <label for="p1">
            Color
          </label>
        </th>
        <td>
          <input type="text" id="p1" value="red">
        </td>
      </tr>
      <tr>
        <th>
          <label for="p2">
            Text
          </label>
        </th>
        <td>
          <input type="text" value="title text here" id="p2">
        </td>
      </tr>
      <tr>
        <th>
          <label for="p3">
              Lock
          </label>
        </th>
        <td>
          <input type="checkbox" id="p3">
        </td>
      </tr>
      <tr>
        <th>
          <label for="p4">
            Align
          </label>
        </th>
        <td>
          <select id="p4">
            <option value=""> left</option>
            <option value=""> center</option>
            <option value=""> right</option>
          </select>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "PropertyElement"
}
</script>

<style scoped>
table {
  width: 100%;
}

th {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-right: 0;
  width: 45%;
  border-bottom: 0;
  font-weight: normal;
  font-size: 12px;
}

td {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 0;
}

tr:last-child td, tr:last-child th {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

input, select {
  background: transparent;
  color: #ffffff;
  border: 0;
  padding: 4px;
  font-weight: bold;
  font-size: 15px;
  display: block;
  width: 100%;
}

select option {
  color: #20252b;
}

input:focus, input:hover, select:hover, select:focus {
  outline-color: #666666;
  outline-width: 1px;
  outline-style: dashed;
}

input[type='checkbox'] {
  outline: none !important;
  margin: 7px auto;
  width: 100%;
}

label{
  display: block;
}
</style>