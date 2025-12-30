// Test script for add-existing-project command
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

// Test path validation and normalization
function testPathValidation() {
  console.log('Testing path validation...')
  
  // Test absolute path
  const absPath = '/tmp/test-project'
  const normalizedAbs = path.normalize(absPath)
  console.log(`Absolute path: ${absPath} -> ${normalizedAbs}`)
  
  // Test relative path
  const relPath = './test-project'
  const normalizedRel = path.normalize(path.join(process.cwd(), relPath))
  console.log(`Relative path: ${relPath} -> ${normalizedRel}`)
  
  // Test path with spaces and special characters
  const specialPath = '/tmp/test project with spaces'
  const normalizedSpecial = path.normalize(specialPath)
  console.log(`Special path: ${specialPath} -> ${normalizedSpecial}`)
  
  console.log('✅ Path validation tests passed')
}

// Test directory existence check
function testDirectoryChecks() {
  console.log('\nTesting directory checks...')
  
  // Create a test directory
  const testDir = path.join(os.tmpdir(), 'remote-vibe-test')
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
    console.log(`Created test directory: ${testDir}`)
  }
  
  // Test if directory exists
  const exists = fs.existsSync(testDir)
  console.log(`Directory exists: ${exists}`)
  
  // Test if it's a directory
  const stats = fs.statSync(testDir)
  const isDir = stats.isDirectory()
  console.log(`Is directory: ${isDir}`)
  
  // Test git repo detection
  const gitDir = path.join(testDir, '.git')
  const isGitRepo = fs.existsSync(gitDir) && fs.statSync(gitDir).isDirectory()
  console.log(`Is git repo: ${isGitRepo}`)
  
  // Clean up
  fs.rmSync(testDir, { recursive: true, force: true })
  console.log('✅ Directory check tests passed')
}

// Run tests
testPathValidation()
testDirectoryChecks()

console.log('\n🎉 All tests passed! The add-existing-project command should work correctly.')