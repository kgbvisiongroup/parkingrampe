module.exports = {
  apps: [
    {
      name: "parkingrampe",
      cwd: "/opt/parkingrampe.rs",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3010
      }
    }
  ]
}
