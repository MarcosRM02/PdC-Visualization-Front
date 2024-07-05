// No se si este archivo debe ir aqui, pero lo pongo de momento, ya que es el unico sitio donde uso plotly.js

// he hecho este archivo para poder usar plotly en el proyecto, ya que no se puede importar directamente en el proyecto

declare module "plotly.js-dist-min" {
  const Plotly: any; // Usa any o una definición de tipo más específica si es necesario
  export = Plotly; // Ver como exportar solo relyout de plotly que es lo que me interesa de momento
}
