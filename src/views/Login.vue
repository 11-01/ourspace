<template>
  <div class="login-page">
    <div class="login-card">
      <h1>💕 OurSpace</h1>
      <p class="sub">属于我们的私密空间</p>
      <el-form @submit.prevent="onLogin">
        <el-input v-model="email" placeholder="邮箱" size="large" style="margin-bottom:14px" />
        <el-input v-model="password" type="password" placeholder="密码" size="large" show-password style="margin-bottom:14px" />
        <el-button type="primary" size="large" :loading="loading" @click="onLogin" style="width:100%">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { ElMessage } from 'element-plus'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

async function onLogin() {
  if (!email.value || !password.value) return ElMessage.warning('请输入邮箱和密码')
  loading.value = true
  const { error } = await supabase.auth.signInWithPassword({ email: email.value, password: password.value })
  loading.value = false
  if (error) {
    console.error('登录错误:', error.message)
    return ElMessage.error('登录失败: ' + (error.message || '未知错误'))
  }
  router.push('/')
}
</script>

<style scoped>
.login-page { height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #fce4ec, #f3e5f5, #e8eaf6); }
.login-card { background: #fff; border-radius: 20px; padding: 48px 36px; width: 360px; box-shadow: 0 8px 40px rgba(0,0,0,.06); text-align: center; }
.login-card h1 { font-size: 28px; margin-bottom: 6px; }
.sub { font-size: 14px; color: #bbb; margin-bottom: 28px; }
</style>
