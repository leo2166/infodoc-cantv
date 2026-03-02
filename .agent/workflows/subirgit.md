---
description: Subir todos los cambios al repositorio Git de infodoc-cantv automáticamente sin preguntar nada
---

// turbo-all
1. Ejecutar git add para agregar todos los cambios:
```
cmd /c "git add ."
```

2. Ejecutar git commit con mensaje automático usando fecha y hora actual:
```
cmd /c "git commit -m "deploy: actualizacion %date% %time%""
```

3. Ejecutar git push para subir al repositorio remoto:
```
cmd /c "git push"
```
