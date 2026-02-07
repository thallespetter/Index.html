// Data Store
let documents = [];
let currentFilter = { discipline: 'all', phase: 'all', type: 'all' };
let currentView = 'grid';

// Engineering Knowledge Base
const engineeringDB = {
    disciplines: {
        electric: {
            color: '#f59e0b',
            keywords: ['elétrico', 'eletrico', 'cabo', 'cable', 'motor', 'painel', 'quadro', 'transformador', 'disjuntor', 'chave', 'partida', 'potência', 'iluminação', 'terra', 'aterramento', 'ccm', 'qGBT', 'subestação'],
            docTypes: ['diagrama_unifilar', 'diagrama_multifilar', 'fluxo_potência', 'single_line', 'layout_elétrico', 'detalhe_montagem', 'lista_cabos', 'memorial_descritivo'],
            materials: ['cabo', 'eletroduto', 'disjuntor', 'contator', 'relé', 'motor', 'transformador', 'chave', 'tomada', 'interruptor', 'quadro', 'painel'],
            equipment: ['motor', 'bomba', 'ventilador', 'compressor', 'gerador', 'transformador', 'inversor', 'soft-starter']
        },
        civil: {
            color: '#3b82f6',
            keywords: ['civil', 'estrutura', 'concreto', 'fundação', 'piso', 'cobertura', 'alvenaria', 'hidráulico', 'sanitário', 'drenagem', 'arquitetura', 'layout', 'grade', 'galpão'],
            docTypes: ['planta_baixa', 'corte', 'fachada', 'detalhe_estrutural', 'fundação', 'layout', 'malha_viaria', 'drenagem'],
            materials: ['concreto', 'aço', 'tijolo', 'bloco', 'cimento', 'areia', 'brita', 'tubo', 'conexão', 'laje', 'viga', 'pilar'],
            equipment: ['escavadeira', 'betoneira', 'guindaste', 'compactador']
        },
        mechanical: {
            color: '#ef4444',
            keywords: ['mecânico', 'mecanico', 'máquina', 'equipamento', 'bomba', 'ventilador', 'compressor', 'trocador', 'calor', 'vaso', 'pressão', 'tanque', 'silos', 'transportador', 'correia', 'elevador'],
            docTypes: ['desenho_conjunto', 'desenho_detalhe', 'fluxograma', 'BOM', 'lista_materiais', 'memorial_cálculo', 'especificação_técnica'],
            materials: ['aço_carbono', 'aço_inox', 'alumínio', 'bronze', 'mancal', 'rolamento', 'vedação', 'parafuso', 'porca', 'mola', 'engrenagem', 'correia'],
            equipment: ['bomba', 'ventilador', 'compressor', 'trocador_calor', 'reator', 'tanque', 'silos', 'moega', 'transportador']
        },
        instrumentation: {
            color: '#10b981',
            keywords: ['instrumentação', 'instrumentacao', 'instrumento', 'sensor', 'transmissor', 'válvula', 'controle', 'automação', 'automacao', 'CLP', 'DCS', 'SCADA', 'malha', 'loop', 'PID'],
            docTypes: ['diagrama_malha', 'loop_sheet', 'instalação_instrumento', 'especificação_instrumento', 'IO_list', 'cable_schedule'],
            materials: ['transmissor', 'sensor', 'válvula', 'posicionador', 'conversor', 'isolador', 'cabo_sinal', 'cabo_coaxial', 'tubo_impulso'],
            equipment: ['transmissor_pressão', 'transmissor_nível', 'transmissor_vazão', 'transmissor_temp', 'válvula_controle', 'válvula_on-off']
        },
        piping: {
            color: '#ec4899',
            keywords: ['tubulação', 'tubulacao', 'piping', 'isométrico', 'isometrico', 'PID', 'P&ID', 'fluido', 'vapor', 'água', 'agua', 'óleo', 'oleo', 'gas', 'gás', 'caldeira', 'bomba', 'válvula'],
            docTypes: ['isométrico', 'PID', 'P&ID', 'layout_tubulação', 'suporte', 'passagem', 'teste_hidrostático', 'limpeza_química'],
            materials: ['tubo', 'curva', 'tee', 'redução', 'válvula', 'flange', 'junta', 'parafuso', 'suporte', 'mola', 'trava'],
            equipment: ['bomba', 'trocador_calor', 'vaso_pressão', 'filtro', 'medidor_vazão', 'válvula_segurança']
        },
        safety: {
            color: '#8b5cf6',
            keywords: ['segurança', 'seguranca', 'PGR', 'PCMSO', 'NR', 'incêndio', 'incendio', 'alarme', 'detecção', 'extintor', 'hidrante', 'sprinkler', 'emergência', 'emergencia', 'evacuação', 'evacuacao'],
            docTypes: ['PGR', 'PCMSO', 'PPRA', 'LI', 'LTIP', 'plano_emergência', 'desenho_combate', 'layout_evacuação', 'APR'],
            materials: ['extintor', 'hidrante', 'mangueira', 'sprinkler', 'detector', 'sirene', 'luz_emergência', 'placa', 'EPI'],
            equipment: ['central_alarme', 'bomba_incêndio', 'reservatório', 'sistema_fixo']
        }
    },
    
    phases: {
        conceptual: { name: 'Conceitual', color: '#60a5fa', weight: 0.6 },
        definitive: { name: 'Definitivo', color: '#34d399', weight: 0.8 },
        constructive: { name: 'Executivo', color: '#fbbf24', weight: 0.9 },
        asbuilt: { name: 'As-Built', color: '#a78bfa', weight: 1.0 }
    },

    docTypes: {
        drawing: { name: 'Desenho', icon: 'fa-drafting-compass' },
        diagram: { name: 'Diagrama', icon: 'fa-project-diagram' },
        material_list: { name: 'Lista de Materiais', icon: 'fa-list-ol' },
        cable_list: { name: 'Lista de Cabos', icon: 'fa-network-wired' },
        spec: { name: 'Especificação', icon: 'fa-file-contract' },
        calculation: { name: 'Memorial de Cálculo', icon: 'fa-calculator' },
        procedure: { name: 'Procedimento', icon: 'fa-clipboard-list' }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadDemoDocuments();
});

function setupEventListeners() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');

    uploadZone.addEventListener('click', () => fileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
}

function handleFiles(fileList) {
    showToast('info', 'Analisando documentos...', 'Processando metadados técnicos');
    
    Array.from(fileList).forEach((file, index) => {
        setTimeout(() => {
            const doc = analyzeDocument(file);
            documents.push(doc);
            renderDocuments();
            updateStats();
            
            if (index === fileList.length - 1) {
                showToast('success', 'Análise concluída', `${fileList.length} documento(s) processado(s)`);
            }
        }, index * 500);
    });
}

function analyzeDocument(file) {
    const name = file.name.toLowerCase();
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Determine discipline
    const discipline = determineDiscipline(name);
    
    // Determine phase
    const phase = determinePhase(name);
    
    // Determine document type
    const docType = determineDocType(name, extension);
    
    // Extract TAGs
    const tags = extractTAGs(name, discipline);
    
    // Extract materials
    const materials = extractMaterials(name, discipline);
    
    // Calculate relevance
    const relevance = calculateRelevance(name, discipline, phase, docType, tags);
    
    // Determine equipment references
    const equipment = determineEquipment(name, discipline);

    return {
        id: Date.now() + Math.random(),
        name: file.name,
        size: formatFileSize(file.size),
        extension: extension,
        discipline: discipline,
        phase: phase,
        type: docType,
        tags: tags,
        materials: materials,
        equipment: equipment,
        relevance: relevance,
        revision: extractRevision(name),
        date: new Date().toLocaleDateString('pt-BR'),
        lastModified: file.lastModified,
        description: generateDescription(discipline, docType, tags)
    };
}

function determineDiscipline(filename) {
    for (const [disc, data] of Object.entries(engineeringDB.disciplines)) {
        if (data.keywords.some(kw => filename.includes(kw))) {
            return disc;
        }
    }
    
    // Default based on extension
    if (filename.includes('.xls') || filename.includes('lista')) return 'mechanical';
    if (filename.includes('cabo') || filename.includes('cable')) return 'electric';
    
    return 'civil'; // default
}

function determinePhase(filename) {
    if (filename.includes('asbuilt') || filename.includes('as-built') || filename.includes('as built')) return 'asbuilt';
    if (filename.includes('executivo') || filename.includes('constructivo')) return 'constructive';
    if (filename.includes('definitivo') || filename.includes('detalhamento')) return 'definitive';
    if (filename.includes('conceitual') || filename.includes('conceito') || filename.includes('preliminar')) return 'conceptual';
    
    // Check revision number - high revision often means definitive/executive
    const revMatch = filename.match(/[rR](\d+)|[rR]ev[_-]?(\d+)|(\d+)[-_][rR]/);
    if (revMatch) {
        const rev = parseInt(revMatch[1] || revMatch[2] || revMatch[3]);
        if (rev >= 5) return 'constructive';
        if (rev >= 2) return 'definitive';
    }
    
    return 'conceptual';
}

function determineDocType(filename, extension) {
    if (extension === 'xls' || extension === 'xlsx') {
        if (filename.includes('cabo') || filename.includes('cable')) return 'cable_list';
        return 'material_list';
    }
    
    if (filename.includes('diagrama') || filename.includes('fluxo') || filename.includes('unifilar') || filename.includes('PID') || filename.includes('P&ID')) {
        return 'diagram';
    }
    
    if (filename.includes('especificacao') || filename.includes('especificação') || filename.includes('spec')) {
        return 'spec';
    }
    
    if (filename.includes('calculo') || filename.includes('cálculo') || filename.includes('memorial')) {
        return 'calculation';
    }
    
    if (filename.includes('procedimento') || filename.includes('procedimento')) {
        return 'procedure';
    }
    
    if (extension === 'dwg' || extension === 'pdf' || filename.includes('desenho') || filename.includes('planta')) {
        return 'drawing';
    }
    
    return 'drawing';
}

function extractTAGs(filename, discipline) {
    const tags = [];
    const patterns = [
        /[A-Z]{2}-[A-Z]{2,3}-\d{3,4}/g,  // e.g., EL-MOT-001
        /[A-Z]{2,3}-\d{4}/g,               // e.g., BOM-0001
        /TAG[_-]?\d+/gi,                   // e.g., TAG_001
        /\d{4}[A-Z]/g,                     // e.g., 1001A
        /EQ-\d+/g,                         // e.g., EQ-001
    ];
    
    patterns.forEach(pattern => {
        const matches = filename.match(pattern) || [];
        tags.push(...matches);
    });
    
    // Discipline-specific patterns
    if (discipline === 'electric') {
        const elecTags = filename.match(/(CCM|QGBT|QD|TS|SE)-\d+/gi) || [];
        tags.push(...elecTags);
    }
    
    if (discipline === 'instrumentation') {
        const instTags = filename.match(/(TT|PT|FT|LT|TE|PI|FI)-\d+/g) || [];
        tags.push(...instTags);
    }
    
    return [...new Set(tags)].slice(0, 5); // unique, max 5
}

function extractMaterials(filename, discipline) {
    const materials = [];
    const discData = engineeringDB.disciplines[discipline];
    
    if (!discData) return materials;
    
    // Simulate material extraction based on document type and discipline
    const qty = Math.floor(Math.random() * 20) + 5;
    
    discData.materials.forEach((mat, idx) => {
        if (idx < 3) { // max 3 materials preview
            materials.push({
                name: mat.replace(/_/g, ' ').toUpperCase(),
                quantity: Math.floor(Math.random() * qty) + 1,
                unit: ['m', 'un', 'kg', 'm²'][Math.floor(Math.random() * 4)],
                type: getMaterialType(mat)
            });
        }
    });
    
    return materials;
}

function getMaterialType(material) {
    if (material.includes('cabo')) return 'cable';
    if (material.includes('tubo') || material.includes('eletroduto')) return 'pipe';
    if (material.includes('aço') || material.includes('aco')) return 'steel';
    if (material.includes('transmissor') || material.includes('sensor')) return 'instrument';
    return 'general';
}

function determineEquipment(filename, discipline) {
    const discData = engineeringDB.disciplines[discipline];
    if (!discData) return [];
    
    return discData.equipment.filter(eq => {
        const eqName = eq.replace(/_/g, ' ');
        return filename.includes(eq) || filename.includes(eqName);
    }).slice(0, 3);
}

function calculateRelevance(filename, discipline, phase, docType, tags) {
    let score = 50; // base score
    
    // Phase weight
    score += (engineeringDB.phases[phase]?.weight || 0.5) * 30;
    
    // Document type weight
    if (docType === 'asbuilt' || docType === 'material_list') score += 15;
    if (docType === 'diagram' || docType === 'drawing') score += 10;
    
    // Has TAGs
    if (tags.length > 0) score += 10;
    
    // Keywords indicating importance
    const importantTerms = ['principal', 'main', 'critico', 'crítico', 'emergencia', 'emergência', 'seguranca', 'segurança'];
    if (importantTerms.some(term => filename.includes(term))) score += 10;
    
    // Recent revision
    const revMatch = filename.match(/[rR](\d+)|[rR]ev[_-]?(\d+)/);
    if (revMatch) {
        const rev = parseInt(revMatch[1] || revMatch[2]);
        if (rev >= 3) score += 5;
    }
    
    return Math.min(Math.round(score), 100);
}

function extractRevision(filename) {
    const match = filename.match(/[rR](\d+)|[rR]ev[_-]?(\d+)|(\d+)[-_][rR]/);
    if (match) {
        const rev = match[1] || match[2] || match[3];
        return `Rev. ${rev}`;
    }
    return 'Rev. 0';
}

function generateDescription(discipline, docType, tags) {
    const discName = engineeringDB.disciplines[discipline] ? 
        engineeringDB.disciplines[discipline].name : discipline;
    const typeName = engineeringDB.docTypes[docType]?.name || docType;
    
    let desc = `${typeName} de ${discName}`;
    if (tags.length > 0) {
        desc += ` - TAGs: ${tags.join(', ')}`;
    }
    return desc;
}

// Rendering
function renderDocuments() {
    const grid = document.getElementById('docsGrid');
    
    let filtered = documents;
    
    // Apply filters
    if (currentFilter.discipline !== 'all') {
        filtered = filtered.filter(d => d.discipline === currentFilter.discipline);
    }
    if (currentFilter.phase !== 'all') {
        filtered = filtered.filter(d => d.phase === currentFilter.phase);
    }
    if (currentFilter.type !== 'all') {
        filtered = filtered.filter(d => d.type === currentFilter.type);
    }
    
    // Search
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(d => 
            d.name.toLowerCase().includes(searchTerm) ||
            d.tags.some(t => t.toLowerCase().includes(searchTerm)) ||
            d.equipment.some(e => e.toLowerCase().includes(searchTerm))
        );
    }
    
    // Sort by relevance
    filtered.sort((a, b) => b.relevance - a.relevance);
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-secondary);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>Nenhum documento encontrado</h3>
                <p>Ajuste os filtros ou faça upload de novos arquivos</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(doc => {
        const discData = engineeringDB.disciplines[doc.discipline];
        const phaseData = engineeringDB.phases[doc.phase];
        const typeData = engineeringDB.docTypes[doc.type];
        
        return `
            <div class="doc-card" onclick="showDetails(${doc.id})">
                <div class="doc-preview ${doc.discipline}">
                    <i class="fas ${typeData?.icon || 'fa-file'} preview-icon" style="color: ${discData?.color || '#999'}"></i>
                    <span class="doc-type-badge" style="color: ${discData?.color || '#999'}; border: 1px solid ${discData?.color || '#999'}">
                        ${discData?.name || doc.discipline}
                    </span>
                    <span class="doc-phase phase-${doc.phase}">${phaseData?.name || doc.phase}</span>
                </div>
                <div class="doc-info">
                    <div class="doc-header">
                        <div class="doc-title" title="${doc.name}">${doc.name}</div>
                        <button class="doc-menu" onclick="event.stopPropagation()">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                    <div class="doc-meta">
                        <span><i class="fas fa-calendar"></i> ${doc.date}</span>
                        <span><i class="fas fa-weight-hanging"></i> ${doc.size}</span>
                        <span><i class="fas fa-code-branch"></i> ${doc.revision}</span>
                    </div>
                    <div class="doc-tags">
                        ${doc.tags.map(tag => `<span class="doc-tag">${tag}</span>`).join('')}
                        ${doc.equipment.map(eq => `<span class="doc-tag" style="background: rgba(14, 165, 233, 0.1); color: var(--primary);">${eq}</span>`).join('')}
                    </div>
                    <div class="doc-footer">
                        <div class="materials-preview">
                            ${doc.materials.slice(0, 3).map(mat => `
                                <div class="material-item ${mat.type}">
                                    <i class="fas ${getMaterialIcon(mat.type)}"></i>
                                    <div class="material-tooltip">${mat.name}<br>${mat.quantity} ${mat.unit}</div>
                                </div>
                            `).join('')}
                            ${doc.materials.length > 3 ? `<div class="material-item more">+${doc.materials.length - 3}</div>` : ''}
                        </div>
                        <div class="relevance-score">
                            <div class="score-bar-mini">
                                <div class="score-fill-mini" style="width: ${doc.relevance}%; background: ${getRelevanceColor(doc.relevance)}"></div>
                            </div>
                            <span style="color: ${getRelevanceColor(doc.relevance)}">${doc.relevance}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getMaterialIcon(type) {
    const icons = {
        cable: 'fa-bolt',
        pipe: 'fa-water',
        steel: 'fa-cubes',
        instrument: 'fa-tachometer-alt',
        general: 'fa-box'
    };
    return icons[type] || 'fa-box';
}

function getRelevanceColor(score) {
    if (score >= 80) return '#ef4444';
    if (score >= 60) return '#f59e0b';
    return '#10b981';
}

// Filter Functions
function filterByDiscipline(discipline) {
    currentFilter.discipline = discipline;
    
    // Update UI
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    renderDocuments();
}

function filterByPhase(phase) {
    currentFilter.phase = phase;
    
    document.querySelectorAll('.phase-tag').forEach(tag => tag.classList.remove('active'));
    event.target.classList.add('active');
    
    renderDocuments();
}

function filterByType(type) {
    currentFilter.type = type;
    renderDocuments();
}

function searchDocs() {
    renderDocuments();
}

function setView(view) {
    currentView = view;
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.view-btn').classList.add('active');
    
    const grid = document.getElementById('docsGrid');
    if (view === 'list') {
        grid.classList.add('list-view');
    } else {
        grid.classList.remove('list-view');
    }
}

function analyzeAll() {
    showToast('info', 'Analisando base de dados...', 'Recalculando relevâncias e relacionamentos');
    
    documents.forEach(doc => {
        doc.relevance = calculateRelevance(doc.name, doc.discipline, doc.phase, doc.type, doc.tags);
    });
    
    setTimeout(() => {
        renderDocuments();
        showToast('success', 'Análise concluída', 'Todos os documentos foram reavaliados');
    }, 1500);
}

// Modal Functions
function showDetails(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    
    const discData = engineeringDB.disciplines[doc.discipline];
    const phaseData = engineeringDB.phases[doc.phase];
    const typeData = engineeringDB.docTypes[doc.type];
    
    document.getElementById('modalTitle').textContent = doc.name;
    document.getElementById('modalSubtitle').textContent = doc.description;
    document.getElementById('modalDiscipline').textContent = discData?.name || doc.discipline;
    document.getElementById('modalDiscipline').style.color = discData?.color || '#fff';
    document.getElementById('modalPhase').textContent = phaseData?.name || doc.phase;
    document.getElementById('modalType').textContent = typeData?.name || doc.type;
    document.getElementById('modalRevision').textContent = doc.revision;
    document.getElementById('modalTags').innerHTML = doc.tags.map(t => `<span style="display: inline-block; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; margin: 0.2rem;">${t}</span>`).join('') || 'Nenhuma TAG identificada';
    document.getElementById('modalScore').textContent = doc.relevance + '%';
    document.getElementById('modalScore').style.color = getRelevanceColor(doc.relevance);
    document.getElementById('modalMeterFill').style.width = doc.relevance + '%';
    document.getElementById('modalMeterFill').style.background = getRelevanceColor(doc.relevance);
    
    // Materials
    const matContainer = document.getElementById('modalMaterials');
    matContainer.innerHTML = doc.materials.map(mat => `
        <div class="material-row">
            <div class="material-info">
                <div class="material-icon ${mat.type}">
                    <i class="fas ${getMaterialIcon(mat.type)}"></i>
                </div>
                <div>
                    <div style="font-weight: 600;">${mat.name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">${mat.type.toUpperCase()}</div>
                </div>
            </div>
            <div class="material-qty">${mat.quantity} ${mat.unit}</div>
        </div>
    `).join('');
    
    // Preview color
    const preview = document.getElementById('modalPreview');
    preview.style.borderBottom = `4px solid ${discData?.color || '#999'}`;
    
    document.getElementById('detailModal').classList.add('active');
}

function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// Utilities
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateStats() {
    document.getElementById('totalDocs').textContent = documents.length;
    const totalMats = documents.reduce((acc, doc) => acc + doc.materials.length, 0);
    document.getElementById('totalMaterials').textContent = totalMats;
    const critical = documents.filter(d => d.relevance >= 80).length;
    document.getElementById('criticalDocs').textContent = critical;
}

function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icons[type]}"></i>
        </div>
        <div>
            <div style="font-weight: 600; margin-bottom: 0.25rem;">${title}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary);">${message}</div>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// Demo Data
function loadDemoDocuments() {
    const demoFiles = [
        { name: 'DIAGRAMA_UNIFILAR_SE_PRINCIPAL_R3.pdf', size: 2500000, discipline: 'electric', type: 'diagram' },
        { name: 'LISTA_CABOS_MOTORES_CCM_001_R2.xlsx', size: 45000, discipline: 'electric', type: 'cable_list' },
        { name: 'PLANTA_BAIXA_GALPAO_PRINCIPAL_ASBUILT.dwg', size: 3500000, discipline: 'civil', type: 'drawing' },
        { name: 'BOM_BOMBA_CIRCULACAO_TAG_BOM_001_R1.xlsx', size: 32000, discipline: 'mechanical', type: 'material_list' },
        { name: 'ISOMETRICO_TUBULACAO_VAPOR_4_POL_ISO_001.pdf', size: 1800000, discipline: 'piping', type: 'drawing' },
        { name: 'LOOP_SHEET_TRANSMissor_PRESSAO_PT_001.pdf', size: 950000, discipline: 'instrumentation', type: 'diagram' },
        { name: 'PGR_PLANO_GERAL_RISCO_2024.docx', size: 2800000, discipline: 'safety', type: 'procedure' },
        { name: 'DETALHE_FUNDAO_TORRE_RESFRIAMENTO_R2.dwg', size: 2100000, discipline: 'civil', type: 'drawing' },
        { name: 'ESPECIFICACAO_MOTOR_ELETRICO_75CV.pdf', size: 1200000, discipline: 'mechanical', type: 'spec' },
        { name: 'DIAGRAMA_PID_REATOR_PRINCIPAL_R4.pdf', size: 3200000, discipline: 'piping', type: 'diagram' }
    ];
    
    demoFiles.forEach((file, index) => {
        setTimeout(() => {
            const doc = analyzeDocument({
                name: file.name,
                size: file.size,
                lastModified: Date.now() - (index * 86400000)
            });
            // Force specific values for demo
            doc.discipline = file.discipline;
            doc.type = file.type;
            documents.push(doc);
            renderDocuments();
            updateStats();
        }, index * 200);
    });
}
