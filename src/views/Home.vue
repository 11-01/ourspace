<template>
  <div class="home">
    <header>
      <h1>💕 OurSpace</h1>
      <el-button text @click="onLogout">退出</el-button>
    </header>

    <div class="tabs">
      <div :class="['tab', { active: tab === 'memo' }]" @click="tab = 'memo'">📝 备忘录</div>
      <div :class="['tab', { active: tab === 'grocery' }]" @click="tab = 'grocery'">🛒 买菜清单</div>
    </div>

    <!-- 备忘录 -->
    <div v-if="tab === 'memo'" class="content">
      <div class="input-row">
        <el-input v-model="memoText" placeholder="添加备忘录..." @keyup.enter="addMemo" />
        <el-button type="primary" @click="addMemo">添加</el-button>
      </div>
      <div v-for="m in memos" :key="m.id" :class="['item', { done: m.done }]">
        <el-checkbox v-model="m.done" @change="toggleMemo(m)" />
        <span class="item-text">{{ m.content }}</span>
        <el-button text type="danger" size="small" @click="delMemo(m.id)">删</el-button>
      </div>
      <el-empty v-if="!memos.length" description="还没有备忘录" />
    </div>

    <!-- 买菜清单 -->
    <div v-if="tab === 'grocery'" class="content">
      <div class="input-row">
        <el-input v-model="groceryName" placeholder="物品名" style="flex:2" @keyup.enter="addGrocery" />
        <el-input-number v-model="groceryQty" :min="1" style="width:80px" />
        <el-button type="primary" @click="addGrocery">添加</el-button>
      </div>
      <div v-for="g in groceries" :key="g.id" :class="['item', { done: g.bought }]">
        <el-checkbox v-model="g.bought" @change="toggleGrocery(g)" />
        <span class="item-text">{{ g.name }} ×{{ g.quantity }}</span>
        <el-button text type="danger" size="small" @click="delGrocery(g.id)">删</el-button>
      </div>
      <el-empty v-if="!groceries.length" description="清单是空的，去逛逛菜市场吧 🥬" />
      <el-button v-if="groceries.some(g => g.bought)" type="warning" style="margin-top:16px;width:100%" @click="clearBought">🗑 清除已购买</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const tab = ref('memo')

// ===== 备忘录 =====
const memos = ref([])
const memoText = ref('')

async function loadMemos() {
  const { data } = await supabase.from('memos').select('*').order('created_at', { ascending: false })
  memos.value = data || []
}
async function addMemo() {
  if (!memoText.value.trim()) return
  await supabase.from('memos').insert({ content: memoText.value.trim() })
  memoText.value = ''
  loadMemos()
}
async function toggleMemo(m) {
  await supabase.from('memos').update({ done: m.done }).eq('id', m.id)
  loadMemos()
}
async function delMemo(id) {
  try { await ElMessageBox.confirm('确认删除？', '删除', { confirmButtonText:'删除', cancelButtonText:'保留', type:'warning' }); await supabase.from('memos').delete().eq('id', id); loadMemos() } catch (_) {}
}

// ===== 买菜清单 =====
const groceries = ref([])
const groceryName = ref('')
const groceryQty = ref(1)

async function loadGroceries() {
  const { data } = await supabase.from('groceries').select('*').order('created_at', { ascending: false })
  groceries.value = data || []
}
async function addGrocery() {
  if (!groceryName.value.trim()) return
  await supabase.from('groceries').insert({ name: groceryName.value.trim(), quantity: groceryQty.value })
  groceryName.value = ''
  groceryQty.value = 1
  loadGroceries()
}
async function toggleGrocery(g) {
  await supabase.from('groceries').update({ bought: g.bought }).eq('id', g.id)
  loadGroceries()
}
async function delGrocery(id) {
  try { await ElMessageBox.confirm('确认删除？', '删除', { confirmButtonText:'删除', cancelButtonText:'保留', type:'warning' }); await supabase.from('groceries').delete().eq('id', id); loadGroceries() } catch (_) {}
}
async function clearBought() {
  try { await ElMessageBox.confirm('清除所有已购买的物品？', '清除', { confirmButtonText:'确认清除', cancelButtonText:'取消', type:'warning' }); await supabase.from('groceries').delete().eq('bought', true); loadGroceries() } catch (_) {}
}

function onLogout() {
  supabase.auth.signOut()
  router.push('/login')
}

onMounted(() => { loadMemos(); loadGroceries() })
</script>

<style scoped>
.home { max-width: 560px; margin: 0 auto; padding: 20px 16px 40px; }
header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
header h1 { font-size: 22px; margin: 0; }
.tabs { display: flex; gap: 0; margin-bottom: 20px; background: #fff; border-radius: 12px; overflow: hidden; }
.tab { flex: 1; text-align: center; padding: 14px 0; font-size: 15px; cursor: pointer; transition: .2s; color: #999; background: #fff; }
.tab.active { color: #fff; background: #e91e63; font-weight: 600; }
.content { background: #fff; border-radius: 16px; padding: 20px; }
.input-row { display: flex; gap: 10px; margin-bottom: 18px; }
.item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
.item.done .item-text { text-decoration: line-through; color: #ccc; }
.item-text { flex: 1; font-size: 15px; }
</style>
